import * as ViewletSize from '../ViewletSize/ViewletSize.js'
import * as ViewletSizeClassName from '../ViewletSizeClassName/ViewletSizeClassName.js'

export const getClassName = (size) => {
  switch (size) {
    case ViewletSize.Small:
      return ViewletSizeClassName.Small
    case ViewletSize.Normal:
      return ViewletSizeClassName.Normal
    case ViewletSize.Large:
      return ViewletSizeClassName.Large
    default:
      return ViewletSizeClassName.None
  }
}
