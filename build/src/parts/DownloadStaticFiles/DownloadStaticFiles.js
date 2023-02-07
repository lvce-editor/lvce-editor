import * as DownloadStaticFile from '../DownloadStaticFile/DownloadStaticFile.js'
import staticFiles from './StaticFiles.json' assert { type: 'json' }
import * as Remove from '../Remove/Remove.js'
import * as Process from '../Process/Process.js'

const downloadStaticFiles = async (staticFiles) => {
  for (const staticFile of staticFiles) {
    console.time(`[download] ${staticFile.name}`)
    await DownloadStaticFile.downloadStaticFile(staticFile)
    console.timeEnd(`[download] ${staticFile.name}`)
  }
}

const main = async () => {
  try {
    await Remove.remove('static/js')
    await Remove.remove('static/lib-css')
    await downloadStaticFiles(staticFiles)
  } catch (error) {
    if (error && error instanceof Error && error.message.includes('Response code 404')) {
      console.error(error.message)
    } else if (error && error instanceof Error && error.message.includes('failed to extract actual url for')) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    Process.exit(1)
  }
}

main()
