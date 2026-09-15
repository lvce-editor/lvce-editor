const accessTokens = new Map()

export const get = (uid) => {
  return accessTokens.get(uid) || ''
}

export const set = (uid, accessToken) => {
  if (accessToken) {
    accessTokens.set(uid, accessToken)
  } else {
    accessTokens.delete(uid)
  }
}

export const clear = (uid) => {
  accessTokens.delete(uid)
}
