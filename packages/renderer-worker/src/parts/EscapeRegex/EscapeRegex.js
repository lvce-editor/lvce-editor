// copied from https://github.com/microsoft/vscode/tree/main/src/vs/base/common/strings.ts by Microsoft (License MIT)

export const escapeRegExpCharacters = (value) => {
  return value.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, '\\$&')
}
