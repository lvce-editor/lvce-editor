import * as GetRunAndDebugRowRenderer from '../GetRunAndDebugRowRenderer/GetRunAndDebugRowRenderer.ts'

export const getRunAndDebugRowVirtualDom = (row) => {
  const renderer = GetRunAndDebugRowRenderer.getRowRenderer(row.type)
  return renderer(row)
}
