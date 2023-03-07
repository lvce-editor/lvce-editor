export const isChromeExtensionError = (error) => {
  return `${error}` === 'Script error.'
}
