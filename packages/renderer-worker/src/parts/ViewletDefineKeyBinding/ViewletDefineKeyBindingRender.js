import * as GetDefineKeyBindingsVirtualDom from '../GetDefineKeyBindingsVirtualDom/GetDefineKeyBindingsVirtualDom.js'

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return ['setValue', newState.value]
  },
}

const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.focused === newState.focused
  },
  apply(oldState, newState) {
    return ['focus']
  },
}

const renderDom = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    const dom = GetDefineKeyBindingsVirtualDom.getDefineKeyBindingsVirtualDom(newState.message)
    return ['setDom', dom]
  },
}

export const hasFunctionalRender = true

export const render = [renderDom, renderValue, renderFocus]
