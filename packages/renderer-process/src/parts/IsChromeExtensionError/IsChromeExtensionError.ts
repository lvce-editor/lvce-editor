export const isChromeExtensionError = (error: Error) => {
  return `${error}` === 'Script error.'
}
