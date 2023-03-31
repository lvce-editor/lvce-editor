// based on https://github.com/microsoft/vscode/blob/3059063b805ed0ac10a6d9539e213386bfcfb852/src/vs/base/common/filters.ts by Microsoft (License MIT)

export const createTable = (size) => {
  const table = []
  for (let i = 0; i < size; i++) {
    const row = new Uint8Array(size)
    table.push(row)
  }
  return table
}
