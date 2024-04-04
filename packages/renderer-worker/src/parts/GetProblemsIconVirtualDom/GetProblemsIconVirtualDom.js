import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getProblemsIconVirtualDom = (type) => {
  if (type === 'warning') {
    return {
      type: VirtualDomElements.Div,
      className: `${ClassNames.ProblemsIcon} ${ClassNames.ProblemsWarningIcon}`,
      childCount: 0,
    }
  }
  return {
    type: VirtualDomElements.Div,
    className: `${ClassNames.ProblemsIcon} ${ClassNames.ProblemsErrorIcon}`,
    childCount: 0,
  }
}
