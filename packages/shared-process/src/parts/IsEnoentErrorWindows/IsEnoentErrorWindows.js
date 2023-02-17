export const isEnoentErrorWindows = (error) => {
  return error && error.message && error.message.includes('The system cannot find the path specified.')
}
