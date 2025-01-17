const RE_HTML = /\.html$/

export const getUrlBaseName = (href) => {
  const fileName = href.slice(href.lastIndexOf('/') + 1)
  const baseName = fileName.replace(RE_HTML, '')
  return baseName
}
