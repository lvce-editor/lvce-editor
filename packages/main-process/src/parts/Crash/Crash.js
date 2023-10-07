const handleTimeout = () => {
  throw new Error('oops')
}

export const crashMainProcess = () => {
  setTimeout(handleTimeout, 0)
}
