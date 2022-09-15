import * as KeyBindingsInitial from '../KeyBindingsInitial/KeyBindingsInitial.js'

export const name = 'KeyBindings'

export const create = () => {
  return {
    parsedKeyBindings: [],
    filteredKeyBindings: [],
  }
}

const parseKey = (rawKey) => {
  const parts = rawKey.split('+')
  let isCtrl = false
  let isShift = false
  let key = ''
  for (const part of parts) {
    switch (part) {
      case 'shift':
        isShift = true
        break
      case 'ctrl':
        isCtrl = true
      default:
        key = part
        break
    }
  }
  return {
    key,
    isCtrl,
    isShift,
  }
}

const parseKeyBinding = (keyBinding) => {
  return {
    ...keyBinding,
    rawKey: keyBinding.key,
    ...parseKey(keyBinding.key),
  }
}

const parseKeyBindings = (keyBindings) => {
  return keyBindings.map(parseKeyBinding)
}

export const loadContent = async (state) => {
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  const parsedKeyBindings = parseKeyBindings(keyBindings)
  console.log({ parsedKeyBindings })
  return {
    ...state,
    parsedKeyBindings,
    filteredKeyBindings: parsedKeyBindings,
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
  const { parsedKeyBindings } = state
  const filteredKeyBindings = getFilteredKeyBindings(parsedKeyBindings, value)
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
