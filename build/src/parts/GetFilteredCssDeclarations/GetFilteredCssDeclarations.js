import * as EagerLoadedCss from '../EagerLoadedCss/EagerLoadedCss.js'

const isEagerLoaded = (cssDeclaration) => {
  for (const eagerLoaded of EagerLoadedCss.eagerLoadedCss) {
    if (cssDeclaration.endsWith(`/${eagerLoaded}`)) {
      return true
    }
  }
  if (cssDeclaration === '/static/lib-css/termterm.css') {
    return true
  }
  return false
}

export const getFilteredCssDeclarations = (cssDeclarations) => {
  if (typeof cssDeclarations === 'string') {
    cssDeclarations = [cssDeclarations]
  }
  const filtered = []
  for (const cssDeclaration of cssDeclarations) {
    if (!isEagerLoaded(cssDeclaration)) {
      filtered.push(cssDeclaration)
    }
  }
  return filtered
}
