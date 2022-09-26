import * as ExtensionInstallType from '../ExtensionInstallType/ExtensionInstallType.js'
import * as Path from '../Path/Path.js'

const parseUrlGithub = (input) => {
  const parts = input.split('/')
  const slashCount = parts.length
  if (slashCount === 5) {
    const user = parts[3]
    const repo = parts[4]
    return {
      type: ExtensionInstallType.GithubRepository,
      options: {
        user,
        repo,
        branch: 'HEAD',
      },
    }
  }
  if (slashCount === 7) {
    const user = parts[3]
    const repo = parts[4]
    const type = parts[5]
    const commit = parts[6]
    if (type === 'tree') {
      return {
        type: ExtensionInstallType.GithubRepository,
        options: {
          user,
          repo,
          branch: commit,
        },
      }
    }
    if (type === 'pull') {
      return {
        type: ExtensionInstallType.ParsingError,
        options: {
          message: 'Cannot download from Pull Request',
        },
      }
    }
  }
  return {
    type: ExtensionInstallType.ParsingError,
    options: {
      message: 'Failed to parse github url',
    },
  }
}

const parseUrl = (input) => {
  if (input.startsWith('https://github.com')) {
    return parseUrlGithub(input)
  }
  if (input.endsWith('.tar.br')) {
    return {
      type: ExtensionInstallType.Url,
      options: {
        url: input,
      },
    }
  }
  return {
    type: ExtensionInstallType.ParsingError,
    options: {
      message: 'Failed to parse url',
    },
  }
}

const parseFile = (input) => {
  return {
    type: ExtensionInstallType.File,
    options: {
      path: input,
    },
  }
}

export const parse = (input) => {
  if (input.startsWith('https://')) {
    return parseUrl(input)
  }
  if (input.startsWith('.')) {
    return parseFile(input)
  }
  if (Path.isAbsolute(input)) {
    return parseFile(input)
  }
  return {
    type: ExtensionInstallType.ParsingError,
    options: {
      message: 'Failed to parse input',
    },
  }
}
