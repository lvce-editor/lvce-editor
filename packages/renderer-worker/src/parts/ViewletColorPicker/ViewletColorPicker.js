export const create = () => {
  return {
    color: '',
  }
}

export const loadContent = (state) => {
  return {
    ...state,
    color: 'blue',
  }
}

const getNewColor = (x) => {
  const max = 300
  const percent = x / max
  const hue = percent * 360
  const newColor = `hsl(${hue}, 100%, 50%)`
  return newColor
}

export const handleSliderPointerDown = (state, x, y) => {
  const newColor = getNewColor(x)
  return {
    ...state,
    color: newColor,
  }
}

export const handleSliderPointerMove = (state, x, y) => {
  const newColor = getNewColor(x)
  return {
    ...state,
    color: newColor,
  }
}

export const hasFunctionalRender = true

const renderColor = {
  isEqual(oldState, newState) {
    return oldState.color === newState.color
  },
  apply(oldState, newState) {
    return [/* method */ 'setColor', /* color */ newState.color]
  },
}

export const render = [renderColor]
