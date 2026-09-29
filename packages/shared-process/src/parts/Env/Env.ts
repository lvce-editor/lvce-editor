export const getFolder = (): any => {
  return process.env.FOLDER
}

export const getAppImagePath = (): any => {
  return process.env.APPIMAGE
}

export const getElectronRunAsNode = (): any => {
  return process.env.ELECTRON_RUN_AS_NODE
}

export const getNodeEnv = (): any => {
  return process.env.NODE_ENV
}

export const getRipGrepPath = (): any => {
  return process.env.RIP_GREP_PATH
}

export const { env } = process
