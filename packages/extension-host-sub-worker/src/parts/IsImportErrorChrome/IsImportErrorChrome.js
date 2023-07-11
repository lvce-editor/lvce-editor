export const isImportErrorChrome = (error) => {
  return error && error instanceof Error && error.message.startsWith('Failed to fetch dynamically imported module')
}
