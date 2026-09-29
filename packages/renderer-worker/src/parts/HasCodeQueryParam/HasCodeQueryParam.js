export const hasCodeQueryParam = (href) => {
  try {
    const url = new URL(href)
    return url.searchParams.has('code')
  } catch {
    return false
  }
}
