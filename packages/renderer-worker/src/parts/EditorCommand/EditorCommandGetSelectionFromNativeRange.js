export const getSelectionFromNativeRange = (editor, range) => {
  if (
    range.startRowIndex === range.endRowIndex &&
    range.startColumnIndex === range.endColumnIndex
  ) {
    const position = {
      rowIndex: range.startRowIndex, // TODO adjust relative position
      columnIndex: range.startColumnIndex,
    }
    return {
      start: position,
      end: position,
    }
  }
  const selection = {
    start: {
      rowIndex: range.startRowIndex, // TODO adjust relative position
      columnIndex: range.startColumnIndex,
    },
    end: {
      rowIndex: range.endRowIndex, // TODO adjust relative position
      columnIndex: range.endColumnIndex,
    },
  }
  return selection
}
