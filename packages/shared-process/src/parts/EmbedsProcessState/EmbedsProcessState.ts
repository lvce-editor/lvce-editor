const state: any = {
  ref: 0,
}

export const increment = (): any => {
  state.ref++
}

export const hasRef = (): any => {
  return state.ref > 0
}

export const decrement = async (): Promise<any> => {
  state.ref--
}
