import { codeFrameColumns } from '../../../../../static/js/babel-code-frame.js'

export const create = (code, location) => {
  return codeFrameColumns(code, location, {
    highlightCode: false,
  })
}
