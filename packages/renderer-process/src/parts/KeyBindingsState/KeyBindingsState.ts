const state: any = {
  identifiers: new Uint32Array(),
}

export const setIdentifiers = (identifiers) => {
  state.identifiers = identifiers
}

export const getIdentifiers = () => {
  return state.identifiers
}
