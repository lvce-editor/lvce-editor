export const pendingStyleSheets = Object.create(null)

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

export const loadCssStyleSheet = async (css) => {
  const response = await fetch(css)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const text = await response.text()
  const sheet = new CSSStyleSheet({})
  await sheet.replace(text)
  document.adoptedStyleSheets.push(sheet)
}
