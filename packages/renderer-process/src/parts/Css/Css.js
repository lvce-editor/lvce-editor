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

const addStyleSheetModern = async (url) => {
  const cssModule = await import(url, {
    assert: { type: 'css' },
  })
  document.adoptedStyleSheets.push(cssModule.default)
}

const addStyleSheetLegacy = async (url) => {
  // TODO use fetch and set inline style or append link rel="stylesheet" to document head
}

export const addStyleSheet = async (url) => {
  try {
    await addStyleSheetModern(url)
  } catch {
    await addStyleSheetLegacy(url)
  }
}
