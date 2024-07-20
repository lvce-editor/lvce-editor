// based on https://github.com/microsoft/vscode/blob/3059063b805ed0ac10a6d9539e213386bfcfb852/src/vs/base/common/filters.ts by Microsoft (License MIT)

export const isPatternInWord = (patternLow: any, patternPos: any, patternLen: any, wordLow: any, wordPos: any, wordLen: any) => {
  while (patternPos < patternLen && wordPos < wordLen) {
    if (patternLow[patternPos] === wordLow[wordPos]) {
      patternPos += 1
    }
    wordPos += 1
  }
  return patternPos === patternLen // pattern must be exhausted
}
