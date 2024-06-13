export const normalizeLine = (line: string) => {
  if (line.startsWith('Error: ')) {
    return line.slice(`Error: `.length)
  }
  if (line.startsWith('VError: ')) {
    return line.slice(`VError: `.length)
  }
  return line
}
