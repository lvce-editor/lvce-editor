import * as Assert from '../Assert/Assert.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const set = async (url, contentSecurityPolicy) => {
  Assert.string(url)
  Assert.string(contentSecurityPolicy)
  if (Platform.getPlatform() === PlatformType.Web) {
    return
  }
  await SharedProcess.invoke('ContentSecurityPolicy.set', url, contentSecurityPolicy)
}
