const toProblem = (diagnostic) => {
  const { message, rowIndex, columnIndex } = diagnostic
  return {
    message,
    rowIndex,
    columnIndex,
  }
}

export const toProblems = (diagnoatics) => {
  return diagnoatics.map(toProblem)
}
