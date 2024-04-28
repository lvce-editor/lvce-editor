import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getDiagnosticVirtualDom = (diagnostic) => {
  const { x, y, width, height } = diagnostic
  console.log({ diagnostic })
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
