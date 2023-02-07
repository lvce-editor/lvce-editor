export const isBabelError = (error) => {
  // @ts-ignore
  return error && error instanceof SyntaxError && error.code === 'BABEL_PARSER_SYNTAX_ERROR'
}
