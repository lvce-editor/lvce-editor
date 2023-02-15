export const create = () => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $Viewlet = document.createElement('div')
  $Viewlet.className = `SashVertical`
  const $SashContent = document.createElement('div')
  $SashContent.className = 'SashVerticalContent'
  $Viewlet.append($SashContent)
  return $Viewlet
}
