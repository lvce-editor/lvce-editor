export const ifElse = (menuOpenFunction, menuClosedFunction) => {
  const ifElseFunction = (state, ...args) => {
    const { isMenuOpen } = state
    if (isMenuOpen) {
      return menuOpenFunction(state, ...args)
    }
    return menuClosedFunction(state, ...args)
  }
  return ifElseFunction
}
