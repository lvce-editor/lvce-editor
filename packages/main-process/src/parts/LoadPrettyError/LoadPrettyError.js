exports.loadPrettyError = async () => {
  const PrettyError = await import('../PrettyError/PrettyError.js')
  return PrettyError
}
