const toProblem = (diagnostic) => {
  const { message } = diagnostic
  return message
}

export const toProblems = (diagnoatics) => {
  return diagnoatics.map(toProblem)
}
