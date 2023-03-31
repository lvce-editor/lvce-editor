import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.js'
import * as SymbolName from '../SymbolName/SymbolName.js'

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
