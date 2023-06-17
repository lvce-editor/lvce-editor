import * as Diagnostics from '../Diagnostics/Diagnostics.js'

export const create = (uid) => {
  return {
    uid,
    problems: [],
    disposed: false,
    focusedIndex: -2,
    message: '',
  }
}

const toProblem = (diagnostic) => {
  const { message } = diagnostic
  return message
}

const toProblems = (diagnoatics) => {
  return diagnoatics.map(toProblem)
}

export const getProblems = async (state) => {
  const diagnostics = await Diagnostics.getDiagnostics()
  const problems = toProblems(diagnostics)
  return problems
}
