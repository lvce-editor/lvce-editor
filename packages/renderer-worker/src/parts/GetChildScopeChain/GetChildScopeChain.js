import * as GetInnerChildScopeChain from '../GetInnerChildScopeChain/GetInnerChildScopeChain.js'

export const getChildScopeChain = async (cache, index, debugId, scopeChain) => {
  const element = scopeChain[index]
  const objectId = element.objectId
  const childScopeChain = await GetInnerChildScopeChain.getInnerChildScopeChain(cache, debugId, objectId, element.indent)
  const newScopeChain = [...scopeChain.slice(0, index + 1), ...childScopeChain, ...scopeChain.slice(index + 1)]
  return newScopeChain
}
