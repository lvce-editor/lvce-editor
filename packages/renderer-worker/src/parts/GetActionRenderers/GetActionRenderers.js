import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const empty = {
  dom: [],
  actions: [],
}

const defaultActionRenderer = (factory, state) => {
  if (!factory.getActions) {
    return empty
  }
  const actions = factory.getActions(state)
  const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
  return { dom, actions }
}

const customActionRenderer = (factory, state) => {
  if (!factory.getCustomActions) {
    return empty
  }
  return { dom: factory.getCustomActions(state), actions: [] }
}

const getActionRenderers = () => {
  return [defaultActionRenderer, customActionRenderer]
}

export const render = (id) => {
  const instance = ViewletStates.getInstance(id)
  if (!instance) {
    return empty
  }
  const state = instance.state
  const factory = instance.factory
  const renderers = getActionRenderers()
  const dom = []
  const actions = []
  for (const renderer of renderers) {
    const result = renderer(factory, state)
    dom.push(...result.dom)
    actions.push(...result.actions)
  }
  return { dom, actions }
}
