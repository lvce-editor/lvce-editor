export const getWindowsUnpackedDir = (arch: string): string => {
  if (arch === 'x64') {
    return 'win-unpacked'
  }
  return `win-${arch}-unpacked`
}
