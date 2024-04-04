import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DiagnosticType from '../DiagnosticType/DiagnosticType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getProblemsIconVirtualDom = (type) => {
  if (type === DiagnosticType.Warning) {
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
