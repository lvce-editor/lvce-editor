
const screenCaptures = Object.create(null)

export const get = (id) => {
  return screenCaptures[id]
}

export const set = (id, captureStream) => {
  screenCaptures[id] = captureStream
}

export const remove = (id,) => {
  delete screenCaptures[id]
}
