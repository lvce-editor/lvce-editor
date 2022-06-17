export const addMarker = (state, marker) => {
  state.selections.push(marker)
}

const CHAR_WIDTH = 20
const LINE_HEIGHT = 20
const WIDTH = 400

const $SelectionCache = []

const allocate$Selection = () => {}

const free$Selections = () => {}

const create$Selection = (x1, x2, i) => {
  const y = i * LINE_HEIGHT // TODO can to y += LINE_HEIGHT to avoid multiplication
  const $Selection = document.createElement('div')
  $Selection.className = 'EditorSelection'
  $Selection.style.width = `${x2 - x1}px`
  $Selection.style.height = `${LINE_HEIGHT}px`
  $Selection.style.transform = `translate(${x1}px, ${y}px)`
  return $Selection
}

const getMaxLineLength = (textDocument) => {
  let max = 0
  for (const line of textDocument.lines) {
    if (line.length > max) {
      max = line.length
    }
  }
  return max
}

export const update = (state, config) => {
  const $$Selections = []
  // TODO don't compute maxlineLength every time, compute once and update if text changes
  const maxLineLength = getMaxLineLength(state.textDocument)

  // TODO renderer worker should convert selection to useful range
  // e.g. if end is before start then reverse them so in renderer process it always has correct order
  // TODO state.sections should always be defined
  const selections = state.selections || []
  for (const selection of selections) {
    if (selection.start.rowIndex === selection.end.rowIndex) {
      const x1 = selection.start.columnIndex * config.columnWidth
      const x2 = selection.end.columnIndex * config.columnWidth
      const $Selection = create$Selection(x1, x2, selection.start.rowIndex)
      $$Selections.push($Selection)
    } else {
      const x1 = selection.start.columnIndex * config.columnWidth
      const x2 = maxLineLength * config.columnWidth
      const $Selection = create$Selection(x1, x2, selection.start.rowIndex)
      $$Selections.push($Selection)
    }
    for (
      let i = selection.start.rowIndex + 1;
      i < selection.end.rowIndex;
      i++
    ) {
      const x1 = 0
      const x2 = maxLineLength * config.columnWidth
      const $Selection = create$Selection(x1, x2, i)
      $$Selections.push($Selection)
    }
    if (selection.start.rowIndex !== selection.end.rowIndex) {
      const x1 = 0
      const x2 = selection.end.columnIndex * config.columnWidth
      const $Selection = create$Selection(x1, x2, selection.end.rowIndex)
      $$Selections.push($Selection)
    }
  }
  while (state.$LayerMarker.firstChild) {
    state.$LayerMarker.firstChild.remove()
  }
  state.$LayerMarker.append(...$$Selections)

  // const html = []
  // for (const marker of state.markers) {
  //   if (marker.startRow !== marker.endRow) {
  //     if (
  //       marker.startRow >= config.firstRow &&
  //       marker.startRow <= config.lastRow
  //     ) {
  //       const height = 20
  //       const width = Math.round(WIDTH - marker.startColumn * CHAR_WIDTH)
  //       const top = (marker.startRow - config.firstRow) * LINE_HEIGHT
  //       const left = Math.round(Math.round(marker.startColumn * CHAR_WIDTH))
  //       html.push(
  //         `<div class="Marker" style="height: ${height}px; width: ${width}px; top: ${top}px; left: ${left}px"`
  //       )
  //     }
  //   }
  // }
  // state.$LayerMarker.innerHTML = html.join('')
}
