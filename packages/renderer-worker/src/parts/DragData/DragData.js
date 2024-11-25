const data = Object.create(null)

export const set = (uid, value) => {
  data[uid] = value
}

export const get = (uid) => {
  return data[uid]
}
