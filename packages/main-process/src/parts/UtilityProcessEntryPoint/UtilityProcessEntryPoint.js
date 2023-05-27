const file = process.argv[2]
if (!file) {
  throw new Error(`file argument is required`)
}
import(file)
