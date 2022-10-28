export const ifElse = (menuOpenFunction, menuClosedFunction) => {
  const ifElseFunction = (state) => {
    const { isMenuOpen } = state
    if (isMenuOpen) {
      return menuOpenFunction(state)
    }
    return menuClosedFunction(state)
  }
  return ifElseFunction
}
