// TODO adjust relative position
export const getSelectionFromNativeRange = (editor, range) => {
  return new Uint32Array([
    range.startRowIndex,
    range.startColumnIndex,
    range.endRowIndex,
    range.endColumnIndex,
  ])
}
