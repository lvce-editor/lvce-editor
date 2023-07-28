export const parseText = (text) => {
  return text.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;', '&')
}
