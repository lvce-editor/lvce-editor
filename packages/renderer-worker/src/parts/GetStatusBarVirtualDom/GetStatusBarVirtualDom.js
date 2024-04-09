import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetStatusBarItemsVirtualDom from '../GetStatusBarItemsVirtualDom/GetStatusBarItemsVirtualDom.js'

export const getStatusBarVirtualDom = (statusBarItemsLeft, statusBarItemsRight) => {
  const dom = []
  if (statusBarItemsLeft.length > 0) {
    dom.push(...GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(statusBarItemsLeft, ClassNames.StatusBarItemsLeft))
  }
  if (statusBarItemsRight.length > 0) {
    dom.push(GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(statusBarItemsRight, ClassNames.StatusBarItemsRight))
  }
  return dom
}
