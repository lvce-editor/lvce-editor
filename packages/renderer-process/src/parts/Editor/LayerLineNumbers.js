import * as Layer from './Layer.js'

const create$Row = () => {}

const render$Row = () => {}

export const renderVisibleLines = (state, firstRow, lastRow) => {
  const getLabel = (_, index) => index
  const visibleItems = [...new Array(lastRow - firstRow)].map(getLabel)
  Layer.prerender(state.$LineNumberRows, create$Row, visibleItems.length)
  Layer.render(state.$LineNumberRows, render$Row, visibleItems)
}
