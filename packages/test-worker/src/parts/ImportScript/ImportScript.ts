export const importScript = async <T>(url: string): Promise<T> => {
  try {
    return await import(url)
  } catch (error) {
    throw error
    // TODO
    // const actualErrorMessage = await TryToGetactualImportErrorMessage.tryToGetActualImportErrorMessage(url, error)
    // throw new Error(actualErrorMessage)
  }
}
