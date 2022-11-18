import * as Api from '../Api/Api.js'

export const mockExec = (fnString) => {
  const fn = new Function(fnString)
  // @ts-ignore
  Api.api.exec = fn
}
