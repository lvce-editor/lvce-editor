import * as CssState from '../CssState/CssState.js'

export const addCssStyleSheet = async (id, text) => {
  const existing = CssState.get(id)
  if (existing) {
    await existing.replace(text)
    return
  }
  const sheet = new CSSStyleSheet({})
  CssState.set(id, sheet)
  await sheet.replace(text)
  document.adoptedStyleSheets.push(sheet)
}
