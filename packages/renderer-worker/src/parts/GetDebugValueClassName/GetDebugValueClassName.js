import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DebugValueType from '../DebugValueType/DebugValueType.js'

export const getDebugValueClassName = (valueType) => {
  console.log({ valueType })
  switch (valueType) {
    case DebugValueType.Undefined:
      return ClassNames.DebugValueUndefined
    case DebugValueType.Number:
      return ClassNames.DebugValueNumber
    case DebugValueType.Symbol:
      return ClassNames.DebugValueSymbol
    case DebugValueType.Boolean:
      return ClassNames.DebugValueBoolean
    case DebugValueType.String:
      return ClassNames.DebugValueString
    default:
      return ''
  }
}
