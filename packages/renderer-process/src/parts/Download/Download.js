export const downloadFile = (fileName, url) => {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
}
