import * as KeyBindingsInitial from '../KeyBindingsInitial/KeyBindingsInitial.js'

export const name = 'KeyBindings'

export const create = () => {
  return {
    keyBindings: [],
    filteredKeyBindings: [],
  }
}

export const loadContent = async (state) => {
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  return {
    ...state,
    keyBindings,
    filteredKeyBindings: keyBindings,
  }
}

const getFilteredKeyBindings = (keyBindings, value) => {
  const filteredKeyBindings = []
  for (const keyBinding of keyBindings) {
    if (keyBinding.command.includes(value) || keyBinding.key.includes(value)) {
      filteredKeyBindings.push(keyBinding)
    }
  }
  return filteredKeyBindings
}

export const handleInput = (state, value) => {
  const { keyBindings } = state
  const filteredKeyBindings = getFilteredKeyBindings(keyBindings, value)
  return {
    ...state,
    value,
    filteredKeyBindings,
  }
}

export const hasFunctionalRender = true

const renderKeyBindings = {
  isEqual(oldState, newState) {
    return oldState.filteredKeyBindings === newState.filteredKeyBindings
  },
  apply(oldState, newState) {
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'KeyBindings',
      /* method */ 'setKeyBindings',
      /* error */ newState.filteredKeyBindings,
    ]
  },
}

export const render = [renderKeyBindings]
