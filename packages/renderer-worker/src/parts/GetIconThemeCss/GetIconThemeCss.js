import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getBackgroundUrl = (extensionPath, value) => {
  if (Platform.platform === PlatformType.Web) {
    return `${extensionPath}${value}`
  }
  if (extensionPath.startsWith('http://')) {
    return `${extensionPath}${value}`
  }
  // TODO what if the file in on linux and includes a backslash?
  if (extensionPath.includes('\\')) {
    const extensionUri = extensionPath.replaceAll('\\', '/')
    return `/remote/${extensionUri}/${value}`
  }
  return `/remote${extensionPath}/${value}`
}

export const getIconThemeCss = (iconTheme) => {
  const rules = []
  const iconDefinitions = iconTheme.json.iconDefinitions
  const extensionPath = iconTheme.extensionPath
  for (const [key, value] of Object.entries(iconDefinitions)) {
    const backgroundUrl = getBackgroundUrl(extensionPath, value)
    rules.push(`.FileIcon${key} { background-image: url(${backgroundUrl}) }`)
  }
  const rulesCss = JoinLines.joinLines(rules)
  return rulesCss
}
