import * as Layer from './Layer.js'

const create$Row = () => {}

const render$Row = () => {}

export const renderVisibleLines = (state, firstRow, lastRow) => {
  const isVisible = (decoration) =>
    decoration.rowIndex >= firstRow && decoration.rowIndex <= lastRow
  const visibleItems = state.decorations.filter(isVisible)
  Layer.prerender(state.$LineNumberRows, create$Row, visibleItems.length)
  Layer.render(state.$LineNumberRows, render$Row, visibleItems)
}
