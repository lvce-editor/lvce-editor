import * as DebugValueType from '../DebugValueType/DebugValueType.js'

export const getDebugValueType = (child) => {
  if (child && child.value && child.value.type) {
    return child.value.type
  }
  if (child.get) {
    return DebugValueType.Getter
  }
  return DebugValueType.None
}
