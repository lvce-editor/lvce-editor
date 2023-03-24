import * as ViewletSize from '../ViewletSize/ViewletSize.js'

export const getViewletSize = (width) => {
  if (width < 180) {
    return ViewletSize.Small
  }
  if (width < 768) {
    return ViewletSize.Normal
  }
  return ViewletSize.Large
}
