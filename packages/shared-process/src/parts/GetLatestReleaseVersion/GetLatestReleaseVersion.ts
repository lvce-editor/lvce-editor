import * as GetHttpErrorMessage from '../GetHttpErrorMessage/GetHttpErrorMessage.ts'
import * as NetworkProcess from '../NetworkProcess/NetworkProcess.ts'
import { VError } from '../VError/VError.ts'

const parseVersionFromUrl = (url: any, repository: any): any => {
  if (!url.includes('releases/tag')) {
    if (url.endsWith('/releases')) {
      throw new Error(`no releases found for ${repository}`)
    }
    throw new Error(`cannot parse release version from url ${url}`)
  }
  const slashIndex = url.lastIndexOf('/')
  const version = url.slice(slashIndex + 1)
  if (version.startsWith('v')) {
    return version.slice(1)
  }
  return version
}

export const getLatestReleaseVersion = async (repository: any): Promise<any> => {
  try {
    const url = `https://github.com/${repository}/releases/latest`
    const finalUrl = await NetworkProcess.invoke('Download.getUrl', {
      method: 'HEAD',
      url,
    })
    const version = parseVersionFromUrl(finalUrl, repository)
    return version
  } catch (error) {
    if (error && error.name === 'HTTPError') {
      const httpErrorMessage = GetHttpErrorMessage.getHttpErrorMessage(error)
      throw new VError(`Failed to get latest release for ${repository}: ${httpErrorMessage}`)
    }
    // @ts-ignore
    throw new VError(error, `Failed to get latest release for ${repository}`)
  }
}
