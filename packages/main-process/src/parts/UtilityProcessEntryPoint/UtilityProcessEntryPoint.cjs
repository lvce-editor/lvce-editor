const main = async () => {
  const argv = process.argv.slice(2)
  const file = argv[0]
  if (!file) {
    throw new Error(`file argument is required`)
  }
  await import(file)
}

main()
