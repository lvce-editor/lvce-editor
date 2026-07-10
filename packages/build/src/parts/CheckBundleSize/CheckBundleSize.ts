import * as CommitHash from '../CommitHash/CommitHash.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as ReadJson from '../JsonFile/JsonFile.ts'
import * as PrettyBytes from '../PrettyBytes/PrettyBytes.ts'
import * as Process from '../Process/Process.ts'
import * as Stat from '../Stat/Stat.ts'

const computeResults = async (budget) => {
  const commitHash = await CommitHash.getCommitHash()
  const actual = Object.create(null)
  const warnings: any[] = []
  const errors: any[] = []
  for (const group in budget) {
    const packageName = group === 'rendererProcess' ? 'renderer-process' : 'renderer-worker'
    actual[group] = Object.create(null)
    for (const key of Object.keys(budget[group])) {
      try {
        actual[group][key] = await Stat.getGzipFileSize(`packages/build/.tmp/dist/${commitHash}/packages/${packageName}/dist/${key}.js`)
      } catch (error) {
        // @ts-ignore
        if (error && error.code === ErrorCodes.ENOENT) {
          warnings.push(`key ${key} not found in ${group}`)
        } else {
          console.log(error)
        }
      }
    }
  }
  console.log({ actual })

  for (const group in budget) {
    for (const key of Object.keys(actual[group])) {
      // @ts-ignore
      if (PrettyBytes.parse(actual[group][key]) > PrettyBytes.parse(budget[group][key])) {
        errors.push({
          fileName: key,
          actualSize: actual[group][key],
          expectedSize: budget[group][key],
        })
      }
    }
  }
  return {
    errors,
    warnings,
  }
}

const checkBundleSize = async () => {
  const budget = await ReadJson.readJson('packages/build/files/bundlesize.config.json')
  const results = await computeResults(budget)
  if (results.errors.length > 0) {
    console.error(`Bundle Size Error: ${results.errors.length} size assertions failed:`)
    console.error(results.errors)
    Process.exit(ExitCode.Error)
  }
  if (results.warnings.length > 0) {
    console.log(results.warnings)
  }
  console.log(`Success: ${Object.keys(budget.rendererProcess).length + Object.keys(budget.rendererWorker).length} Size assertions passed`)
}

const main = async () => {
  await checkBundleSize()
}

main()
