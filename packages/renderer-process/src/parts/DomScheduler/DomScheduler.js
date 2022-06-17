// this module is for grouping dom writes
// so that there is only
// 1 recalculate style, 1 layout, 1 paint

export const state = {
  domFns: [],
}

export const push = (fn) => {
  state.domFns.push(fn)
}

export const run = () => {
  for (const fn of state.domFns) {
    fn()
  }
  state.domFns = []
}
