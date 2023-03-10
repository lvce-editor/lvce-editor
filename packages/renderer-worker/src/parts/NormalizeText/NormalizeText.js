export const normalizeText = (text, normalize, tabSize) => {
  if (normalize) {
    return text.replaceAll('\t', ' '.repeat(tabSize))
  }
  return text
}

export const shouldNormalizeText = (text) => {
  return text.includes('\t')
}
