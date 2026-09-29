import * as GetLicenseUri from '../GetLicenseUri/GetLicenseUri.js'
import * as OpenUri from '../OpenUri/OpenUri.js'

export const openLicense = async () => {
  const uri = await GetLicenseUri.getLicenseUri()
  await OpenUri.openUri(uri)
}
