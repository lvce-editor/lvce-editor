import * as Clamp from '../Clamp/Clamp.ts'

const getNewColor = (x: number, max: number) => {
  const percent = x / max
  const hue = percent * 360
  const newColor = `hsl(${hue}, 100%, 50%)`
  return newColor
}

export const loadContent = (state: any) => {
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

export const handleSliderPointerDown = (state: any, x: number, y: number) => {
  const { min, max } = state
  const newX = Clamp.clamp(x, min, max)
  const newColor = getNewColor(newX, max)
  return {
    ...state,
    color: newColor,
    offsetX: newX,
  }
}

export const handleSliderPointerMove = (state: any, x: number, y: number) => {
  const { min, max } = state
  const newX = Clamp.clamp(x, min, max)
  const newColor = getNewColor(newX, max)
  return {
    ...state,
    color: newColor,
    offsetX: newX,
  }
}
