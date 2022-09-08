export const ITEM_HEIGHT = 62

export const MINIMUM_SLIDER_SIZE = 20

export const HEADER_HEIGHT = 35.94 // TODO improve this

export const getListHeight = (state) => {
  return state.height - HEADER_HEIGHT
}
