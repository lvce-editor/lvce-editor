export interface ByteRange {
  readonly end: number
  readonly start: number
}

const byteRangeRegex = /^bytes=(\d*)-(\d*)$/

const isValidInteger = (value: number): boolean => {
  return Number.isSafeInteger(value) && value >= 0
}

export const getByteRange = (rangeHeader: string, size: number): ByteRange | undefined => {
  const match = byteRangeRegex.exec(rangeHeader)
  if (!match || size <= 0) {
    return undefined
  }

  const [, startText, endText] = match
  if (!startText && !endText) {
    return undefined
  }

  if (!startText) {
    const suffixLength = Number(endText)
    if (!isValidInteger(suffixLength) || suffixLength === 0) {
      return undefined
    }
    return {
      end: size - 1,
      start: Math.max(0, size - suffixLength),
    }
  }

  const start = Number(startText)
  const requestedEnd = endText ? Number(endText) : size - 1
  if (!isValidInteger(start) || !isValidInteger(requestedEnd) || start >= size || start > requestedEnd) {
    return undefined
  }
  return {
    end: Math.min(requestedEnd, size - 1),
    start,
  }
}
