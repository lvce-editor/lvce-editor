import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DiagnosticType from '../DiagnosticType/DiagnosticType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getDiagnosticClassName = (type) => {
  // TODO use classnames enum
  switch (type) {
    case DiagnosticType.Error:
      return 'DiagnosticError'
    case DiagnosticType.Warning:
      return 'DiagnosticWarning'
    default:
      return 'DiagnosticError'
  }
}
export const getDiagnosticVirtualDom = (diagnostic) => {
  const { x, y, width, height, type } = diagnostic
  const extraClassName = getDiagnosticClassName(type)
  return [
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.Diagnostic} ${extraClassName}`,
      width,
      height,
      top: y,
      left: x,
      childCount: 0,
    },
  ]
}
