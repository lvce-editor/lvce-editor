import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getDiagnosticVirtualDom = (diagnostic) => {
  const { x, y, width, height } = diagnostic
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Diagnostic,
      width,
      height,
      top: y,
      left: x,
      childCount: 0,
    },
  ]
}

export const getDiagnosticsVirtualDom = (diagnostics) => {
  const dom = diagnostics.flatMap(getDiagnosticVirtualDom)
  return dom
}
