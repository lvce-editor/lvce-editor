import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.js'
import * as Icon from '../Icon/Icon.js'

export const getIcon = (item) => {
  switch (item.kind) {
    case EditorCompletionType.Property:
      return Icon.SymbolProperty
    case EditorCompletionType.Value:
      return Icon.SymbolValue
    case EditorCompletionType.Function:
      return Icon.SymbolFunction
    case EditorCompletionType.Variable:
      return Icon.SymbolVariable
    case EditorCompletionType.Keyword:
      return Icon.SymbolKeyword
    default:
      return Icon.SymbolDefault
  }
}
