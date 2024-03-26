// copied from https://github.com/Rich-Harris/vlq/blob/e3009f5757abeb0b5b6233045f3bbdaf86435d08/src/index.js by Rich Harris (License MIT)

/** @type {Record<string, number>} */
const char_to_integer = {}

/** @type {Record<number, string>} */
const integer_to_char = {}

for (const [i, char] of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('').entries()) {
  char_to_integer[char] = i
  integer_to_char[i] = char
}

/** @param {string} string */
export const decode = (string) => {
  /** @type {number[]} */
  const result = []

  let shift = 0
  let value = 0

  for (let i = 0; i < string.length; i += 1) {
    let integer = char_to_integer[string[i]]

    if (integer === undefined) {
      throw new Error('Invalid character (' + string[i] + ')')
    }

    const has_continuation_bit = integer & 32

    integer &= 31
    value += integer << shift

    if (has_continuation_bit) {
      shift += 5
    } else {
      const should_negate = value & 1
      value >>>= 1

      if (should_negate) {
        result.push(value === 0 ? -0x80000000 : -value)
      } else {
        result.push(value)
      }

      // reset
      value = shift = 0
    }
  }

  return result
}
