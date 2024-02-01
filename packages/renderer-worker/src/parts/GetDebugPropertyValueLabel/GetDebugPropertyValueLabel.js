import * as DebugValueType from '../DebugValueType/DebugValueType.js'
import * as GetDebugPropertyValueLabelBoolean from '../GetDebugPropertyValueLabelBoolean/GetDebugPropertyValueLabelBoolean.js'
import * as GetDebugPropertyValueLabelCommon from '../GetDebugPropertyValueLabelCommon/GetDebugPropertyValueLabelCommon.js'
import * as GetDebugPropertyValueLabelObject from '../GetDebugPropertyValueLabelObject/GetDebugPropertyValueLabelObject.js'
import * as GetDebugPropertyValueLabelString from '../GetDebugPropertyValueLabelString/GetDebugPropertyValueLabelString.js'
import * as GetDebugPropertyValueLabelUndefined from '../GetDebugPropertyValueLabelUndefined/GetDebugPropertyValueLabelUndefined.js'

export const getDebugPropertyValueLabel = (property) => {
  switch (property.type) {
    case DebugValueType.Number:
    case DebugValueType.Symbol:
    case DebugValueType.Function:
      return GetDebugPropertyValueLabelCommon.getDebugPropertyValueLabelCommon(property)
    case DebugValueType.Object:
      return GetDebugPropertyValueLabelObject.getDebugPropertyValueLabelObject(property)
    case DebugValueType.Undefined:
      return GetDebugPropertyValueLabelUndefined.getDebugPropertyValueLabelString(property)
    case DebugValueType.String:
      return GetDebugPropertyValueLabelString.getDebugPropertyValueLabelString(property)
    case DebugValueType.Boolean:
      return GetDebugPropertyValueLabelBoolean.getDebugPropertyValueLabelBoolean(property)
    default:
      return `${JSON.stringify(property)}`
  }
}
