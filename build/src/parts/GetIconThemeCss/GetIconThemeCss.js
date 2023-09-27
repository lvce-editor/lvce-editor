import * as JoinLines from '../JoinLines/JoinLines.js'

const getBackgroundUrl = (extensionPath, value) => {
  return `${extensionPath}/${value.slice(7)}`
}

export const getIconThemeCss = (iconTheme, extensionPath) => {
  const iconDefinitions = iconTheme.iconDefinitions
  const rules = []
  for (const [key, value] of Object.entries(iconDefinitions)) {
    const backgroundUrl = getBackgroundUrl(extensionPath, value)
    rules.push(`.FileIcon${key} { background-image: url(${backgroundUrl}) }`)
  }
  const rulesCss = JoinLines.joinLines(rules)
  return rulesCss
}
