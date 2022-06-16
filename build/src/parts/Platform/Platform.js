export const isWindows = () => {
  return process.platform === 'win32'
}

export const isMacos = () => {
  return process.platform === 'darwin'
}

export const isLinux = () => {
  return process.platform === 'linux'
}
