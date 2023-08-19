export const getDebArch = (processArch) => {
  switch (processArch) {
    case 'arm64':
      return 'arm64'
    case 'x64':
      return 'amd64'
    case 'arm':
      return 'armhf'
    default:
      return ''
  }
}
