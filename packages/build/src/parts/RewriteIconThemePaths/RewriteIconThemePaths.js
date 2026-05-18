export const rewriteIconThemePaths = (content, iconBasePath) => {
  return content.replaceAll('"/icons/', `"${iconBasePath}/`)
}
