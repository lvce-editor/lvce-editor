import { createHash } from 'node:crypto'

export const getWorkspaceId = (absolutePath: any): any => {
  return createHash('sha256').update(absolutePath).digest('hex').slice(0, 16)
}
