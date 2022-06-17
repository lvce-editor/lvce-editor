export const getItem = (key) => {
  return localStorage.getItem(key) || undefined
}

export const setItem = (key, value) => {
  localStorage.setItem(key, value)
}

export const clear = () => {
  localStorage.clear()
}
