import * as EditorStrings from '../EditorStrings/EditorStrings.ts'

// @ts-ignore
export const getNoLocationFoundMessage = (info) => {
  if (info.word) {
    return EditorStrings.noTypeDefinitionFoundFor(info.word)
  }
  return EditorStrings.noTypeDefinitionFound()
}