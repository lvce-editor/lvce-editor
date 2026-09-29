const RE_HTML = /\.html$/

export const getUrlBaseName = (href) => {
  const { pathname } = new URL(href)
  const fileName = pathname.slice(pathname.lastIndexOf('/') + 1)
  const baseName = fileName.replace(RE_HTML, '')
  return baseName
}
