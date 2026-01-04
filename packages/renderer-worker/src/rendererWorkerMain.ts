import * as Workbench from './parts/Workbench/Workbench.js'
import * as Platform from './parts/Platform/Platform.js'
import * as AssetDir from './parts/AssetDir/AssetDir.js'

const main = async () => {
  await Workbench.startup(Platform.getPlatform(), AssetDir.assetDir)
}

main()
