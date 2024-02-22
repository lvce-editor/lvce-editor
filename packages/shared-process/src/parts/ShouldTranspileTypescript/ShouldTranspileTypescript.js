import * as IsTypeScriptPath from '../IsTypeScriptPath/IsTypeScriptPath.js'

export const shouldTranspileTypescript = (request, url) => {
  if (!IsTypeScriptPath.isTypeScriptPath(url)) {
    return false
  }
  const acceptHeader = request.headers['accept']
  if (acceptHeader === 'text/plain') {
    return false
  }
  return true
}
