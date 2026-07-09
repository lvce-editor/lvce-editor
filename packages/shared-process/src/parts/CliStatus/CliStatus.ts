import * as GetStatusString from '../GetStatusString/GetStatusString.ts'

export const handleCliArgs = async (argv: any): Promise<any> => {
  const statusString = await GetStatusString.getStatusString()
  console.info(statusString)
}
