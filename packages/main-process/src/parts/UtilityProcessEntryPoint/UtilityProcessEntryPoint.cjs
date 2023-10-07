const { pathToFileURL } = require('node:url')

const importScript = async (path) => {
  const url = pathToFileURL(path).toString()
  await import(url)
}

const main = async () => {
  const argv = process.argv.slice(2)
  const file = argv[0]
  if (!file) {
    throw new Error(`file argument is required`)
  }
  await importScript(file)
}

main()
