exports.isNetFileNotFoundError = (error) => {
  return error && error instanceof Error && error.message === 'net::ERR_FILE_NOT_FOUND'
}
