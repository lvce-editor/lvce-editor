import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as GetInitialLineState from '../GetInitialLineState/GetInitialLineState.js'
import * as SafeTokenizeLine from '../SafeTokenizeLine/SafeTokenizeLine.js'

export const getIncrementalEdits = (oldState, newState) => {
  const lastChanges = newState.undoStack.at(-1)
  if (lastChanges && lastChanges.length === 1) {
    const lastChange = lastChanges[0]
    if (lastChange.origin === EditOrigin.EditorType) {
      const rowIndex = lastChange.start.rowIndex
      const lines = newState.lines
      const oldLine = oldState.lines[rowIndex]
      const newLine = lines[rowIndex]
      const initialLineState = newState.lineCache[rowIndex] || GetInitialLineState.getInitialLineState(newState.tokenizer.initialLineState)
      const { tokens: oldTokens } = SafeTokenizeLine.safeTokenizeLine(
        newState.languageId,
        oldState.tokenizer.tokenizeLine,
        oldLine,
        initialLineState,
        newState.tokenizer.hasArrayReturn,
      )
      const { tokens: newTokens, lineState } = SafeTokenizeLine.safeTokenizeLine(
        newState.languageId,
        newState.tokenizer.tokenizeLine,
        newLine,
        initialLineState,
        newState.tokenizer.hasArrayReturn,
      )
      if (newTokens.length !== oldTokens.length) {
        return undefined
      }
      const incrementalEdits = []
      let offset = 0
      const relativeRowIndex = rowIndex - newState.minLineY
      for (let i = 0; i < oldTokens.length; i += 2) {
        const oldTokenType = oldTokens[i]
        const oldTokenLength = oldTokens[i + 1]
        const newTokenType = newTokens[i]
        const newTokenLength = newTokens[i + 1]
        if (oldTokenType === newTokenType && oldTokenLength !== newTokenLength && oldTokenLength > 0) {
          const columnTokenIndex = i / 2
          incrementalEdits.push({
            rowIndex: relativeRowIndex,
            columnIndex: columnTokenIndex,
            text: newLine.slice(offset, offset + newTokenLength),
          })
        }
        offset += newTokenLength
      }
      if (incrementalEdits.length === 1) {
        return incrementalEdits
      }
    }
  }
  return undefined
}
