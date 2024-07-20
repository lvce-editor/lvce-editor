import * as GetDiagnosticVirtualDom from '../GetDiagnosticVirtualDom/GetDiagnosticVirtualDom.ts'

export const getDiagnosticsVirtualDom = (diagnostics: any[]) => {
  const dom = diagnostics.flatMap(GetDiagnosticVirtualDom.getDiagnosticVirtualDom)
  return dom
}
