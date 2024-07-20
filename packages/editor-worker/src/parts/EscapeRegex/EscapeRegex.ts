// copied from https://github.com/microsoft/vscode/tree/main/src/vs/base/common/strings.ts by Microsoft (License MIT)

const RE_ESCAPE = /[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g

export const escapeRegExpCharacters = (value: string) => {
  return value.replaceAll(RE_ESCAPE, '\\$&')
}
