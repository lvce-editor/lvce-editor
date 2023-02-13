export const create = () => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Sash SashVertical SashVisible'
  const $SashContent = document.createElement('div')
  $SashContent.className = 'SashContent'
  $Viewlet.append($SashContent)
  return $Viewlet
}
