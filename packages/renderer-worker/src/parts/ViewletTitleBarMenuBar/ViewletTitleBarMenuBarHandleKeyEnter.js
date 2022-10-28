const handleKeyEnterMenuOpen = (state) => {
  // TODO
  // await Menu.selectCurrent()
  return state
}

const handleKeyEnterMenuClosed = (state) => {
  return openMenu(state, /* focus */ true)
}

export const handleKeyEnter = (state) => {
  return ifElse(state, handleKeyEnterMenuOpen, handleKeyEnterMenuClosed)
}
