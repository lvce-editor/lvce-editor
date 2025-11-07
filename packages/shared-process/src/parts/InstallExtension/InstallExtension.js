import * as Download from '../Download/Download.js'
import * as Extract from '../Extract/Extract.js'
import * as Path from '../Path/Path.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as Queue from '../Queue/Queue.js'
import { VError } from '../VError/VError.js'

export const installExtension = async (id) => {
  // TODO this should be a stateless function, renderer-worker should have info on marketplace url
  // TODO use command.execute
  try {
    const marketplaceUrl = PlatformPaths.getMarketplaceUrl()
    const cachedExtensionsPath = PlatformPaths.getCachedExtensionsPath()
    const extensionsPath = PlatformPaths.getExtensionsPath()
    // TODO maybe a queue is over engineering here
    await Queue.add('download', async () => {
      // TODO use command.execute
      await Download.download(`${marketplaceUrl}/download/${id}`, Path.join(cachedExtensionsPath, `${id}.tar.br`))
      await Extract.extractTarBr(Path.join(cachedExtensionsPath, `${id}.tar.br`), Path.join(extensionsPath, id))
    })
    // TODO should this be here? (probably not)
    // await ExtensionHost.enableExtension({
    //   id,
    //   type: 'marketplace',
    // })
  } catch (error) {
    throw new VError(error, `Failed to install extension "${id}"`)
  }
}
