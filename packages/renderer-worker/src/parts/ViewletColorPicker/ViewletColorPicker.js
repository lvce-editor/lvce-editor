import * as Clamp from '../Clamp/Clamp.js'

export const create = () => {
  return {
    color: '',
    offsetX: 0,
    min: 0,
    max: 0,
  }
}

const getNewColor = (x, max) => {
  const percent = x / max
  const hue = percent * 360
  const newColor = `hsl(${hue}, 100%, 50%)`
  return newColor
}

export const loadContent = (state) => {
  const max = 300
  const x = 20
  const color = getNewColor(x, max)
  return {
    ...state,
    offsetX: x,
    color,
    max,
  }
}

export const handleSliderPointerDown = (state, x, y) => {
  const { min, max } = state
  const newX = Clamp.clamp(x, min, max)
  const newColor = getNewColor(newX, max)
  return {
    ...state,
    color: newColor,
    offsetX: newX,
  }
}

export const handleSliderPointerMove = (state, x, y) => {
  const { min, max } = state
  const newX = Clamp.clamp(x, min, max)
  const newColor = getNewColor(newX, max)
  return {
    ...state,
    color: newColor,
    offsetX: newX,
  }
}
