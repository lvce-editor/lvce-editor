import * as CssState from '../CssState/CssState.js'

export const addCssStyleSheet = async (id, text) => {
  const existing = CssState.get(id)
  if (existing) {
    await existing.replace(text)
  } else {
    const sheet = new CSSStyleSheet({})
    await sheet.replace(text)
    document.adoptedStyleSheets.push(sheet)
  }
}
