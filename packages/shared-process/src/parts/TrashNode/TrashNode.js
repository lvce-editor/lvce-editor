import _trash from 'trash'

export const trash = async (path) => {
  await _trash(path)
}
