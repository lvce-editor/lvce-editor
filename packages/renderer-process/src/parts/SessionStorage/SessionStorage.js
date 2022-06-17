export const getItem = (key) => {
  return sessionStorage.getItem(key) || undefined
}

export const setItem = (key, value) => {
  sessionStorage.setItem(key, value)
}

export const clear = () => {
  sessionStorage.clear()
}
