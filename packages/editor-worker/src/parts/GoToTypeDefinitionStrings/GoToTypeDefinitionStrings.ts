import * as EditorStrings from '../EditorStrings/EditorStrings.ts'

export const getNoLocationFoundMessage = (info: any) => {
  if (info.word) {
    return EditorStrings.noTypeDefinitionFoundFor(info.word)
  }
  return EditorStrings.noTypeDefinitionFound()
}
