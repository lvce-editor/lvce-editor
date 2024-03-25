export const getFolder = () => {
  return process.env.FOLDER
}

export const getAppImagePath = () => {
  return process.env.APPIMAGE
}

export const getElectronRunAsNode = () => {
  return process.env.ELECTRON_RUN_AS_NODE
}

export const getNodeEnv = () => {
  return process.env.NODE_ENV
}

export const getRipGrepPath = () => {
  return process.env.RIP_GREP_PATH
}

export const { env } = process
