import * as FormatAboutDate from '../FormatAboutDate/FormatAboutDate.js'
import * as GetBrowser from '../GetBrowser/GetBrowser.js'
import * as Process from '../Process/Process.js'

export const getDetailStringWeb = () => {
  const version = Process.version
  const commit = Process.commit
  const date = Process.date
  const formattedDate = FormatAboutDate.formatAboutDate(date)
  const browser = GetBrowser.getBrowser()
  const lines = [`Version: ${version}`, `Commit: ${commit}`, `Date: ${formattedDate}`, `Browser: ${browser}`]
  return lines
}
