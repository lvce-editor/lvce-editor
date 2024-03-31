import * as Platform from '../Platform/Platform.js'

export const getSharedProcessArgv = () => {
  if (Platform.isProduction) {
    return ['--enable-source-maps']
  }
  if (process.versions.node === '18.19.1') {
    // node<=20.5, deprecated
    return ['--loader', '@swc-node/register/esm']
  }
  // node>=20.6
  return ['--import', '@swc-node/register/esm-register']
}
