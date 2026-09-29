export const isEnoentErrorWindows = (error: any): any => {
  return (
    error &&
    error.message &&
    (error.message.includes('The system cannot find the file specified.') || error.message.includes('The system cannot find the path specified.'))
  )
}
