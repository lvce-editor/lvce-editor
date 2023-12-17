import * as MeasureTitleBarEntryWidth from '../MeasureTitleBarEntryWidth/MeasureTitleBarEntryWidth.js'
import * as TitleBarMenuBarEntries from '../TitleBarMenuBarEntries/TitleBarMenuBarEntries.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    titleBarEntries: [],
    focusedIndex: -1,
    isMenuOpen: false,
    menus: [],
    labelFontWeight: 400,
    labelFontSize: 13,
    labelFontFamily: 'system-ui, Ubuntu, Droid Sans, sans-serif',
    labelPadding: 8,
    labelLetterSpacing: 0,
    titleBarHeight: height,
    x,
    y,
    width,
    height,
  }
}

const addWidths = (entries, labelPadding, fontWeight, fontSize, fontFamily, letterSpacing) => {
  const withWidths = []
  for (const entry of entries) {
    const textWidth = MeasureTitleBarEntryWidth.measureTitleBarEntryWidth(entry.label, fontWeight, fontSize, fontFamily, letterSpacing)
    const width = textWidth + labelPadding * 2
    withWidths.push({ ...entry, width })
  }
  return withWidths
}

export const loadContent = async (state) => {
  const { labelFontFamily, labelFontSize, labelFontWeight, labelLetterSpacing, labelPadding, width } = state
  const titleBarEntries = await TitleBarMenuBarEntries.getEntries()
  const withWidths = addWidths(titleBarEntries, labelPadding, labelFontWeight, labelFontSize, labelFontFamily, labelLetterSpacing)
  // const visible = GetVisibleTitleBarEntries.getVisibleTitleBarEntries(withWidths, width)
  // console.log({ visible })
  return {
    ...state,
    titleBarEntries: withWidths,
  }
}
