import * as Debug from '../Debug/Debug.js'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as GetDebugPropertyValueLabel from '../GetDebugPropertyValueLabel/GetDebugPropertyValueLabel.js'
import * as GetDebugValueObjectId from '../GetDebugValueObjectId/GetDebugValueObjectId.js'
import * as GetDebugValueType from '../GetDebugValueType/GetDebugValueType.js'

const getInnerChildScopeChain = (childScopes, indent) => {
  const childScopeChain = []
  for (const child of childScopes.result.result) {
    const valueLabel = GetDebugPropertyValueLabel.getDebugPropertyValueLabel(child.value || child.get || {})
    childScopeChain.push({
      type: DebugScopeChainType.Property,
      key: child.name,
      value: valueLabel,
      valueType: GetDebugValueType.getDebugValueType(child),
      objectId: GetDebugValueObjectId.getDebugValueObjectId(child),
      indent: indent + 10,
    })
  }
  return childScopeChain
}

export const getChildScopeChain = async (index, debugId, scopeChain) => {
  const element = scopeChain[index]
  const objectId = element.objectId
  const childScopes = await Debug.getProperties(debugId, objectId)
  const childScopeChain = getInnerChildScopeChain(childScopes, element.indent)
  const newScopeChain = [...scopeChain.slice(0, index + 1), ...childScopeChain, ...scopeChain.slice(index + 1)]
  return newScopeChain
}
