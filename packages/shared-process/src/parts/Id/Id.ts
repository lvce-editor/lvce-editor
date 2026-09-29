export const state: any = {
  id: 0,
}

export const create = (): any => {
  return ++state.id
}
