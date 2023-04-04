export const create = () => {
  return {
    finished: false,
  }
}

export const cancel = (token) => {
  token.finished = true
}

export const isCanceled = (token) => {
  return token.finished
}
