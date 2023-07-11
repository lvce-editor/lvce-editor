import * as GetStatusString from '../GetStatusString/GetStatusString.js'

export const handleCliArgs = async (argv) => {
  const statusString = await GetStatusString.getStatusString()
  console.info(statusString)
}
