import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.js'
import * as EditorCompletionClassName from '../EditorCompletionClassName/EditorCompletionClassName.js'

export const getIcon = (item) => {
  switch (item.kind) {
    case EditorCompletionType.Property:
      return EditorCompletionClassName.IconProperty
    case EditorCompletionType.Value:
      return EditorCompletionClassName.IconValue
    case EditorCompletionType.Function:
      return EditorCompletionClassName.IconFunction
    case EditorCompletionType.Variable:
      return EditorCompletionClassName.IconVariable
    case EditorCompletionType.Keyword:
      return EditorCompletionClassName.IconKeyword
    default:
      return EditorCompletionClassName.IconDefault
  }
}
