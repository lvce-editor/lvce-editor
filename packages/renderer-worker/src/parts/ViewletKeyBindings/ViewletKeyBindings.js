import * as KeyBindingsInitial from '../KeyBindingsInitial/KeyBindingsInitial.js'

export const name = 'KeyBindings'

export const create = () => {
  return {
    keyBindings: {},
  }
}

export const loadContent = async (state) => {
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  console.log({ keyBindings })
  return {
    ...state,
    keyBindings,
  }
}

export const hasFunctionalRender = true

const renderKeyBindings = {
  isEqual(oldState, newState) {
    return oldState.keyBindings === newState.keyBindings
  },
  apply(oldState, newState) {
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'KeyBindings',
      /* method */ 'setKeyBindings',
      /* error */ newState.keyBindings,
    ]
  },
}

export const render = [renderKeyBindings]
