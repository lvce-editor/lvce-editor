export const isImportErrorFirefox = (error) => {
  return error && error instanceof TypeError && error.message === 'error loading dynamically imported module'
}
