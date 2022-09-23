const getRemoteBaseUrl = (extensionPath) => {
  // TODO what if the file in on linux and includes a backslash?
  if (extensionPath.includes('\\')) {
    const extensionUri = extensionPath.replaceAll('\\', '/')
    return `/remote/${extensionUri}`
  }
  return `/remote${extensionPath}`
}

export const getIconThemeCss = (json, extensionPath) => {
  const rules = []
  const iconDefinitions = json.iconDefinitions
  const remoteBaseUrl = getRemoteBaseUrl(extensionPath)
  for (const [key, value] of Object.entries(iconDefinitions)) {
    const backgroundUrl = `${remoteBaseUrl}${value}`
    rules.push(`.Icon${key} { background-image: url(${backgroundUrl}) }`)
  }
  const rulesCss = rules.join('\n')
  return rulesCss
}
