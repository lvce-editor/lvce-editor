import * as GetStatusString from '../GetStatusString/GetStatusString.js'

export const handleCliArgs = async (argv) => {
  console.log({ argv })
  const statusString = GetStatusString.getStatusString()
  console.info(statusString)
}
