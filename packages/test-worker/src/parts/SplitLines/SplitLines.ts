export const splitLines = (lines: string): readonly string[] => {
  if (!lines) {
    return []
  }
  return lines.split('\n')
}
