export const setInlineStyle = (id, css) => {
  const $ExistingStyle = document.getElementById(id)
  if ($ExistingStyle) {
    $ExistingStyle.textContent = css
  } else {
    const $Style = document.createElement('style')
    $Style.id = id
    $Style.textContent = css
    document.head.append($Style)
  }
}

export const addCssStyleSheet = async (text) => {
  const sheet = new CSSStyleSheet({})
  await sheet.replace(text)
  document.adoptedStyleSheets.push(sheet)
}
