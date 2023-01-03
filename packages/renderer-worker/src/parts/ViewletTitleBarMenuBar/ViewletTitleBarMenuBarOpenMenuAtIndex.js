import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'
import * as Menu from '../Menu/Menu.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'

const measureOffset = (titleBarEntries, index, labelFontWeight, labelFontSize, labelFontFamily, labelPadding, labelLetterSpacing) => {
  let offset = 0
  for (let i = 0; i < index; i++) {
    const titleBarEntry = titleBarEntries[i]
    offset += MeasureTextWidth.measureTextWidth(titleBarEntry.label, labelFontWeight, labelFontSize, labelFontFamily, labelLetterSpacing)
    offset += labelPadding * 2
  }
  return offset
}

/**
 * @param {number} index
 * @param {boolean} shouldBeFocused
 */
export const openMenuAtIndex = async (state, index, shouldBeFocused) => {
  const { titleBarEntries, labelFontWeight, labelFontSize, labelFontFamily, labelPadding, titleBarHeight, labelLetterSpacing } = state
  // TODO race conditions
  // TODO send renderer process
  // 1. open menu, items to show
  // 2. focus menu
  const titleBarEntry = titleBarEntries[index]
  const { id, label } = titleBarEntry
  const items = await MenuEntries.getMenuEntries(id)
  const offset = measureOffset(titleBarEntries, index, labelFontWeight, labelFontSize, labelFontFamily, labelPadding, labelLetterSpacing)
  // TODO race condition: another menu might already be open at this point

  const left = offset
  const top = titleBarHeight
  const width = Menu.getMenuWidth()
  const height = Menu.getMenuHeight(items)
  const menuFocusedIndex = shouldBeFocused ? Menu.getIndexToFocusNextStartingAt(items, 0) : -1
  const menu = {
    id,
    items,
    focusedIndex: menuFocusedIndex,
    level: 0,
    left,
    top,
    width,
    height,
  }
  const menus = [menu]
  return {
    ...state,
    isMenuOpen: true,
    focusedIndex: index,
    menus,
  }
}
