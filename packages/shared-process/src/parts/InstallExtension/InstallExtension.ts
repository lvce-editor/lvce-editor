import * as Download from '../Download/Download.ts'
import * as Extract from '../Extract/Extract.ts'
import * as Path from '../Path/Path.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as Queue from '../Queue/Queue.ts'
import { VError } from '../VError/VError.ts'

export const installExtension = async (id: any): Promise<any> => {
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
