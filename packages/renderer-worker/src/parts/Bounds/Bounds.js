const state = {
  width: 0,
  height: 0,
}

export const get = () => {
  return {
    width: state.width,
    height: state.height,
  }
}

export const set = (width, height) => {
  ;((state.width = width), (state.height = height))
}
