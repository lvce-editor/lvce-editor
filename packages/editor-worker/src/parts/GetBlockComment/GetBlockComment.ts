import * as Languages from '../Languages/Languages.ts'

export const getBlockComment = async (editor: any) => {
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  if (!languageConfiguration || !languageConfiguration.comments || !languageConfiguration.comments.blockComment) {
    return undefined
  }
  return languageConfiguration.comments.blockComment
}
