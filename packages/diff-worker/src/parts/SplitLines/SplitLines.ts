import * as Character from '../Character/Character.ts'

export const splitLines = (lines: string | undefined): readonly string[] => {
  if (!lines) {
    return []
  }
  return lines.split(Character.NewLine)
}
