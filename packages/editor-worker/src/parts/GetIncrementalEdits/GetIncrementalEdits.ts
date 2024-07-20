import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as GetInitialLineState from '../GetInitialLineState/GetInitialLineState.ts'
import * as SafeTokenizeLine from '../SafeTokenizeLine/SafeTokenizeLine.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'

export const getIncrementalEdits = (oldState: any, newState: any) => {
  if (!newState.undoStack) {
    return undefined
  }
  const lastChanges = newState.undoStack.at(-1)
  if (lastChanges && lastChanges.length === 1) {
    const lastChange = lastChanges[0]
    if (lastChange.origin === EditOrigin.EditorType) {
      const rowIndex = lastChange.start.rowIndex
      const lines = newState.lines
      const oldLine = oldState.lines[rowIndex]
      const newLine = lines[rowIndex]
      const oldTokenizer = TokenizerMap.get(oldState.tokenizerId)
      const newTokenizer = TokenizerMap.get(newState.tokenizerId)
      const initialLineState = newState.lineCache[rowIndex] || GetInitialLineState.getInitialLineState(newTokenizer.initialLineState)
      const { tokens: oldTokens } = SafeTokenizeLine.safeTokenizeLine(
        newState.languageId,
        oldTokenizer.tokenizeLine,
        oldLine,
        initialLineState,
        newTokenizer.hasArrayReturn,
      )
      // @ts-ignore
      const { tokens: newTokens, lineState } = SafeTokenizeLine.safeTokenizeLine(
        newState.languageId,
        newTokenizer.tokenizeLine,
        newLine,
        initialLineState,
        newTokenizer.hasArrayReturn,
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
