import * as Character from '../Character/Character.js'
import * as DebugDisplay from '../DebugDisplay/DebugDisplay.js'
import * as DebugPausedReason from '../DebugPausedReason/DebugPausedReason.js'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as DebugScopeType from '../DebugScopeType/DebugScopeType.js'
import * as DebugValueType from '../DebugValueType/DebugValueType.js'

const getPropertyValueLabel = (property) => {
  switch (property.type) {
    case DebugValueType.Number:
    case DebugValueType.Object:
      return property.description
    case DebugValueType.Undefined:
      return `undefined`
    default:
      return `${JSON.stringify(property)}`
  }
}

export const getScopeChain = (params, thisObject, scopeChain, knownProperties) => {
  const elements = []
  for (const scope of scopeChain) {
    const label = DebugDisplay.getScopeLabel(scope)
    elements.push({
      type: DebugScopeChainType.Scope,
      key: label,
      value: '',
      valueType: '',
      label,
      indent: 10,
    })
    // if(params.reason)
    if (scope.type === DebugScopeType.Local) {
      if (params.reason === DebugPausedReason.Exception) {
        const value = params.data.description.replaceAll(Character.NewLine, Character.Space)
        elements.push({
          type: DebugScopeChainType.Exception,
          key: 'Exception',
          value,
          valueType: '',
          indent: 20,
        })
      }
      const valueLabel = getPropertyValueLabel(thisObject)
      elements.push({
        type: DebugScopeChainType.This,
        key: 'this',
        value: valueLabel,
        valueType: '',
        indent: 20,
      })
    }
    const children = knownProperties[scope.object.objectId]
    if (children) {
      for (const child of children.result.result) {
        const valueLabel = getPropertyValueLabel(child.value)
        elements.push({
          type: DebugScopeChainType.Property,
          key: child.name,
          value: valueLabel,
          valueType: child.value.type,
          indent: 20,
        })
      }
    }
  }
  return elements
}
