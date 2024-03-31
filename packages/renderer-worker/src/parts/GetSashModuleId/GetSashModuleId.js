import * as SashOrientation from '../SashOrientation/SashOrientation.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getSashModuleId = (orientation) => {
  switch (orientation) {
    case SashOrientation.Horizontal:
      // @ts-ignore
      return ViewletModuleId.VisibleSashHorizontal
    case SashOrientation.Vertical:
      // @ts-ignore
      return ViewletModuleId.VisibleSashVertical
  }
}
