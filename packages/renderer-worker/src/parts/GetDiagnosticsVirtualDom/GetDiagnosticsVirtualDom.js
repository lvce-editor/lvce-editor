import * as GetDiagnosticVirtualDom from '../GetDiagnosticVirtualDom/GetDiagnosticVirtualDom.js'

export const getDiagnosticsVirtualDom = (diagnostics) => {
  const dom = diagnostics.flatMap(GetDiagnosticVirtualDom.getDiagnosticVirtualDom)
  return dom
}
