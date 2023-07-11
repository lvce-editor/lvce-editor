export const toMarkdownTable = (header, rows) => {
  const numberOfColumns = header.length
  const numberOfRows = rows.length
  const maxLengths = [...new Array(numberOfColumns).fill(0)]
  for (let i = 0; i < numberOfColumns; i++) {
    maxLengths[i] = header[i].length
    for (let j = 0; j < numberOfRows; j++) {
      maxLengths[i] = Math.max(maxLengths[i], rows[j][i].length)
    }
  }
  let result = ''
  for (let i = 0; i < numberOfColumns; i++) {
    result += '|'
    result += ' '
    result += header[i]
    result += ' '.repeat(maxLengths[i] - header[i].length)
    result += ' '
  }
  result += '|\n'
  for (let i = 0; i < numberOfColumns; i++) {
    result += '|'
    result += '-'.repeat(maxLengths[i] + 2)
  }
  result += '|\n'
  for (const row of rows) {
    for (let i = 0; i < numberOfColumns; i++) {
      result += '|'
      result += ' '
      result += row[i]
      result += ' '.repeat(maxLengths[i] - row[i].length)
      result += ' '
    }
    result += '|\n'
  }
  return result
}
