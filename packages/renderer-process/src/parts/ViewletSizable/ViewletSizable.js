import * as ViewletSizeMap from '../ViewletSizeMap/ViewletSizeMap.js'

export const setSize = (state, oldSize, newSize) => {
  const { $Viewlet } = state
  const oldClassName = ViewletSizeMap.getClassName(oldSize)
  if (oldClassName) {
    $Viewlet.classList.remove(oldClassName)
  }
  const newClassName = ViewletSizeMap.getClassName(newSize)
  $Viewlet.classList.add(newClassName)
}
