export const isDataCloneError = (error) => {
  return error && error.name === 'DataCloneError'
}
