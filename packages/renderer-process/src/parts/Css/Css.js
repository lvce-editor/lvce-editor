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

// this is not yet supported by firefox, also chrome devtools
// has a bug and doesn't show these requests in the network panel
// maybe we can use css module style sheets later
// const addStyleSheetModern = async (url) => {
//   const cssModule = await import(url, {
//     assert: { type: 'css' },
//   })
//   document.adoptedStyleSheets.push(cssModule.default)
// }

// TODO could also use fetch and set inline style, if that is faster
const addStyleSheetLegacy = async (url) => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.append(link)
  const promiseCallback = (resolve, reject) => {
    const cleanup = () => {
      link.onerror = null
      link.onload = null
    }
    const handleLoad = () => {
      cleanup()
      resolve(undefined)
    }
    const handleError = (event) => {
      cleanup()
      reject(new Error(`${event}`))
    }
    link.onload = handleLoad
    link.onerror = handleError
  }
  await new Promise(promiseCallback)
}

export const addStyleSheet = async (urls) => {
  await addStyleSheetLegacy(urls)
}
