import * as Character from '../Character/Character.js'
import * as DebugDisplay from '../DebugDisplay/DebugDisplay.js'
import * as DebugPausedReason from '../DebugPausedReason/DebugPausedReason.js'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as DebugScopeType from '../DebugScopeType/DebugScopeType.js'
import * as GetDebugPropertyValueLabel from '../GetDebugPropertyValueLabel/GetDebugPropertyValueLabel.js'

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
      objectId: scope.object.objectId,
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
          objectId: scope.object.objectId,
          indent: 20,
        })
      }
      const valueLabel = GetDebugPropertyValueLabel.getDebugPropertyValueLabel(thisObject)
      elements.push({
        type: DebugScopeChainType.This,
        key: 'this',
        value: valueLabel,
        valueType: '',
        objectId: scope.object.objectId,
        indent: 20,
      })
    }
    const children = knownProperties[scope.object.objectId]
    if (children) {
      for (const child of children.result.result) {
        const valueLabel = GetDebugPropertyValueLabel.getDebugPropertyValueLabel(child.value)
        elements.push({
          type: DebugScopeChainType.Property,
          key: child.name,
          value: valueLabel,
          valueType: child.value.type,
          objectId: scope.object.objectId,
          indent: 20,
        })
      }
    }
  }
  return elements
}
