const getRemoteUrl = (extensionPath, tokenizePath) => {
  return `${extensionPath}/${tokenizePath}`
}

export const getLanguagesFromExtension = (extension) => {
  // TODO what if extension is null? should not crash process, handle error gracefully
  // TODO what if extension languages is not of type array?
  // TODO what if language is null?
  if (!extension) {
    return []
  }
  if (!extension.languages) {
    return []
  }
  const extensionPath = extension.path
  const getLanguageFromExtension = (language) => {
    if (language.tokenize) {
      if (typeof language.tokenize !== 'string') {
        console.warn(`[info] ${language.id}: language.tokenize must be of type string but was of type ${typeof language.tokenize}`)
        return {
          ...language,
          extensionPath,
          tokenize: '',
        }
      }
      return {
        ...language,
        extensionPath,
        tokenize: getRemoteUrl(extensionPath, language.tokenize),
      }
    }
    return language
  }
  return extension.languages.map(getLanguageFromExtension)
}
