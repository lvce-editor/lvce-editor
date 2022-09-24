const { readFile, writeFile } = require('node:fs/promises')

exports.readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  const json = JSON.parse(content)
  return json
}

exports.writeJson = async (path, value) => {
  const content = JSON.stringify(value, null, 2) + '\n'
  await writeFile(path, content)
}
