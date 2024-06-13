import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'

export const fromRange = (startRowIndex: number, startColumnIndex: number, endRowIndex: number, endColumnIndex: number) => {
  return new Uint32Array([startRowIndex, startColumnIndex, endRowIndex, endColumnIndex])
}

export const fromRanges = (...items: any[]) => {
  return new Uint32Array(items.flat(1))
}

export const fromPosition = (rowIndex: number, columnIndex: number) => {
  return fromRange(rowIndex, columnIndex, rowIndex, columnIndex)
}

export const alloc = (length: number) => {
  return new Uint32Array(length)
}

export const clone = (selections: any[]) => {
  return alloc(selections.length)
}

export const map = (selections: any[], fn: any) => {
  const newSelections = clone(selections)
  for (let i = 0; i < newSelections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    fn(newSelections, i, selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn)
  }
  return newSelections
}

export const forEach = (selections: any[], fn: any) => {
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    fn(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn)
  }
}

export const moveRangeToPosition = (selections: any[] | Uint32Array, i: number, rowIndex: number, columnIndex: number) => {
  selections[i] = selections[i + 2] = rowIndex
  selections[i + 1] = selections[i + 3] = columnIndex
}

export const isEmpty = (selectionStartRow: number, selectionStartColumn: number, selectionEndRow: number, selectionEndColumn: number) => {
  return selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn
}

const isSelectionSingleLine = (selectionStartRow: number, selectionStartColumn: number, selectionEndRow: number, selectionEndColumn: number) => {
  return selectionStartRow === selectionEndRow
}

export const isEverySelection = (selections: any[], fn: any) => {
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (!fn(selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn)) {
      return false
    }
  }
  return true
}

export const isEverySelectionEmpty = (selections: any[]) => {
  return isEverySelection(selections, isEmpty)
}

export const isEverySelectionSingleLine = (selections: any[]) => {
  return isEverySelection(selections, isSelectionSingleLine)
}

export const from = (array: any[], getSelection: any) => {
  const newSelections = alloc(array.length * 4)
  let i = 0
  for (const item of array) {
    const { start, end } = getSelection(item)
    newSelections[i++] = start.rowIndex
    newSelections[i++] = start.columnIndex
    newSelections[i++] = end.rowIndex
    newSelections[i++] = end.columnIndex
  }
  return newSelections
}

export const push = (selections: any[], startRowIndex: number, startColumnIndex: number, endRowIndex: number, endColumnIndex: number) => {
  const oldLength = selections.length
  const newSelections = alloc(oldLength + 4)
  newSelections.set(selections)
  newSelections[oldLength + 1] = startRowIndex
  newSelections[oldLength + 2] = startColumnIndex
  newSelections[oldLength + 3] = endRowIndex
  newSelections[oldLength + 4] = endColumnIndex
  return newSelections
}
