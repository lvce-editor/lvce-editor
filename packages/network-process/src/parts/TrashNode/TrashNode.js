export const trash = async (path) => {
  const { default: _trash } = await import('trash')
  await _trash(path)
}
