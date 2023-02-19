import * as TextSearchReplaceAll from '../TextSearchReplaceAll/TextSearchReplaceAll.js'

export const replaceAll = async (state) => {
  const { items, replacement } = state
  await TextSearchReplaceAll.replaceAll(items, replacement)
  return state
}
