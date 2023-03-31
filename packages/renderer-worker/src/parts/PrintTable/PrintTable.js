// based on https://github.com/microsoft/vscode/blob/3059063b805ed0ac10a6d9539e213386bfcfb852/src/vs/base/common/filters.ts by Microsoft (License MIT)

const pad = (s, n, pad = ' ') => {
  while (s.length < n) {
    s = pad + s
  }
  return s
}

const padThree = (char) => {
  return pad(char, 3)
}

export const printTable = (table, pattern, patternLen, word, wordLen) => {
  let ret = ` |   |${word.split('').map(padThree).join('|')}\n`

  for (let i = 0; i <= patternLen; i++) {
    if (i === 0) {
      ret += ' |'
    } else {
      ret += `${pattern[i - 1]}|`
    }
    ret += [...table[i].subarray(0, wordLen + 1)].map((n) => pad(n.toString(), 3)).join('|') + '\n'
  }
  return ret
}
