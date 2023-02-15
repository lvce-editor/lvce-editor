import * as SashOrientation from '../SashOrientation/SashOrientation.js'
import * as VisibleSashHorizontal from '../VisibleSashHorizontal/VisibleSashHorizontal.js'
import * as VisibleSashVertical from '../VisibleSashVertical/VisibleSashVertical.js'

export const create = (orientation) => {
  switch (orientation) {
    case SashOrientation.Horizontal:
      return VisibleSashHorizontal.create()
    case SashOrientation.Vertical:
      return VisibleSashVertical.create()
    default:
      throw new Error('unexpected sash orientation')
  }
}
