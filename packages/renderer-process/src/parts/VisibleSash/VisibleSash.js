import * as SashOrientation from '../SashOrientation/SashOrientation.js'

const getOrientationClassName = (orientation) => {
  switch (orientation) {
    case SashOrientation.Vertical:
      return 'SashVertical'
    case SashOrientation.Horizontal:
      return 'SashHorizontal'
    default:
      throw new Error('unexpected sash orientation')
  }
}

export const create = (orientation) => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $Viewlet = document.createElement('div')
  const orientationClassName = getOrientationClassName(orientation)
  $Viewlet.className = `Sash ${orientationClassName} SashVisible`
  const $SashContent = document.createElement('div')
  $SashContent.className = 'SashContent'
  $Viewlet.append($SashContent)
  return $Viewlet
}
