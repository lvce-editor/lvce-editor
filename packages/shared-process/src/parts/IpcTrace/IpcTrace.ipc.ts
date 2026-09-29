import * as IpcTrace from './IpcTrace.ts'

export const name = 'IpcTrace'

export const Commands: Record<string, (...args: any[]) => any> = {
  append: IpcTrace.append,
}
