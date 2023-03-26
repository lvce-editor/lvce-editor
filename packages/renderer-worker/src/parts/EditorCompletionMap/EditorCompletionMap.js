import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.js'
import * as Icon from '../Icon/Icon.js'
import * as SymbolName from '../SymbolName/SymbolName.js'

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

export const getSymbolName = (item) => {
  switch (item.kind) {
    case EditorCompletionType.Property:
      return SymbolName.SymbolProperty
    case EditorCompletionType.Value:
      return SymbolName.SymbolValue
    case EditorCompletionType.Function:
      return SymbolName.SymbolFunction
    case EditorCompletionType.Variable:
      return SymbolName.SymbolVariable
    case EditorCompletionType.Keyword:
      return SymbolName.SymbolKeyword
    default:
      return SymbolName.SymbolDefault
  }
}
