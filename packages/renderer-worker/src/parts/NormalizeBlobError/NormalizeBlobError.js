export const normalizeBlobError = (error) => {
  if (
    error &&
    error instanceof ProgressEvent &&
    error.target &&
    // @ts-ignore
    error.target.error
  ) {
    // @ts-ignore
    return error.target.error
  }
  return error
}
