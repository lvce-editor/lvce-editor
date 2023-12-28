import * as Diagnostics from '../Diagnostics/Diagnostics.js'
import * as ToProblems from '../ToProblems/ToProblems.js'

export const getProblems = async (state) => {
  const diagnostics = await Diagnostics.getDiagnostics()
  const problems = ToProblems.toProblems(diagnostics)
  return problems
}
