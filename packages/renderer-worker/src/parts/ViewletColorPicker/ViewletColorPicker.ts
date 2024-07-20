import * as EditorWorker from '../EditorWorker/EditorWorker.js'

export const create = () => {
  return {
    color: '',
    offsetX: 0,
    min: 0,
    max: 0,
  }
}

export const loadContent = (state) => {
  return EditorWorker.invoke('ColorPicker.loadContent', state)
}

export const handleSliderPointerDown = (state, x, y) => {
  return EditorWorker.invoke('ColorPicker.handleSliderPointerDown', state, x, y)
}

export const handleSliderPointerMove = (state, x, y) => {
  return EditorWorker.invoke('ColorPicker.handleSliderPointerMove', state, x, y)
}
