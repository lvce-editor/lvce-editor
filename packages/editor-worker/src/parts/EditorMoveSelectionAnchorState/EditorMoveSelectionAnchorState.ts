export const state = {
  position: {
    rowIndex: 0,
    columnIndex: 0,
  },
}

export const getPosition = () => {
  return state.position
}

// @ts-ignore
export const setPosition = (position) => {
  state.position = position
}
