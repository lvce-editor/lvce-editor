import * as IsTypeScriptPath from '../IsTypeScriptPath/IsTypeScriptPath.ts'

export const shouldTranspileTypescript = (request: any, url: any): any => {
  if (!IsTypeScriptPath.isTypeScriptPath(url)) {
    return false
  }
  const acceptHeader = request.headers['accept']
  if (acceptHeader === 'text/plain') {
    return false
  }
  return true
}
