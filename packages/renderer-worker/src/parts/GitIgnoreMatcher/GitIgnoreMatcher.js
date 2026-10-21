const escapeRegExp = (character) => /[|\\{}()[\]^$+?.]/.test(character) ? `\\${character}` : character

const globToRegExp = (pattern) => {
  let source = '^'
  for (let index = 0; index < pattern.length; index++) {
    const character = pattern[index]
    const nextCharacter = pattern[index + 1]
    if (character === '*' && nextCharacter === '*') {
      if (pattern[index + 2] === '/') {
        source += '(?:.*/)?'
        index += 2
      } else {
        source += '.*'
        index++
      }
    } else if (character === '*') {
      source += '[^/]*'
    } else if (character === '?') {
      source += '[^/]'
    } else if (character === '[') {
      const end = pattern.indexOf(']', index + 1)
      if (end < 0) {
        source += '\\['
      } else {
        let range = pattern.slice(index + 1, end)
        if (range.startsWith('!')) {
          range = `^${range.slice(1)}`
        }
        source += `[${range}]`
        index = end
      }
    } else {
      source += escapeRegExp(character)
    }
  }
  return new RegExp(`${source}$`)
}

const parseRule = (line) => {
  let pattern = line.trimEnd()
  if (!pattern || pattern.startsWith('#')) {
    return undefined
  }
  let negated = false
  if (pattern.startsWith('!')) {
    negated = true
    pattern = pattern.slice(1)
  } else if (pattern.startsWith('\\!') || pattern.startsWith('\\#')) {
    pattern = pattern.slice(1)
  }
  const rooted = pattern.startsWith('/')
  pattern = pattern.replace(/^\//, '')
  const directoryOnly = pattern.endsWith('/')
  if (directoryOnly) {
    pattern = pattern.slice(0, -1)
  }
  if (!pattern) {
    return undefined
  }
  const hasSlash = rooted || pattern.includes('/')
  return {
    directoryOnly,
    negated,
    pattern: hasSlash ? globToRegExp(pattern) : globToRegExp(pattern),
    segmentOnly: !hasSlash,
  }
}

const ruleMatches = (rule, path, isDirectory) => {
  if (rule.directoryOnly && !isDirectory) {
    return false
  }
  if (rule.segmentOnly) {
    const name = path.slice(path.lastIndexOf('/') + 1)
    return rule.pattern.test(name)
  }
  return rule.pattern.test(path)
}

export const create = (contents = '') => {
  const rules = contents.split(/\r?\n/).map(parseRule).filter((rule) => rule !== undefined)
  return {
    hasNegation: rules.some((rule) => rule.negated),
    isIgnored(path, isDirectory = false) {
      const parts = path.split('/').filter(Boolean)
      let ignored = false
      for (let index = 0; index < parts.length; index++) {
        if (ignored) {
          return true
        }
        const relativePath = parts.slice(0, index + 1).join('/')
        const currentIsDirectory = index < parts.length - 1 || isDirectory
        for (const rule of rules) {
          if (ruleMatches(rule, relativePath, currentIsDirectory)) {
            ignored = !rule.negated
          }
        }
      }
      return ignored
    },
  }
}
