// based on https://github.com/microsoft/vscode/blob/3059063b805ed0ac10a6d9539e213386bfcfb852/src/vs/base/common/filters.ts by Microsoft (License MIT)
import * as Character from '../Character/Character.js'
import * as IsLowerCase from '../IsLowerCase/IsLowerCase.ts'
import * as IsUpperCase from '../IsUpperCase/IsUpperCase.ts'

export const isGap = (columnCharBefore: any, columnChar: any) => {
  switch (columnCharBefore) {
    case Character.Dash:
    case Character.Underline:
    case Character.EmptyString:
    case Character.T:
    case Character.Space:
    case Character.Dot:
      return true
    default:
      break
  }
  if (IsLowerCase.isLowerCase(columnCharBefore) && IsUpperCase.isUpperCase(columnChar)) {
    return true
  }
  return false
}
