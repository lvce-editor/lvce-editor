exports.setStackTraceLimit = (value) => {
  if (Error.stackTraceLimit && Error.stackTraceLimit < value) {
    Error.stackTraceLimit = value
  }
}
