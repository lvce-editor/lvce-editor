import * as MainProcess from '../MainProcess/MainProcess.ts'

export const find = (id: number, text: string, forward: boolean, matchCase: boolean, newSession: boolean): Promise<any> => {
  return MainProcess.invoke('BrowserFind.find', id, text, forward, matchCase, newSession)
}

export const stop = (id: number): Promise<void> => MainProcess.invoke('BrowserFind.stop', id)
