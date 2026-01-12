import * as Workbench from './parts/Workbench/Workbench.js'
import * as Platform from './parts/Platform/Platform.js'
import * as AssetDir from './parts/AssetDir/AssetDir.js'
import * as CommandMapRef from './parts/CommandMapRef/CommandMapRef.js'
import * as CommandMap from './parts/CommandMap/CommandMap.js'

const main = async () => {
  Object.assign(CommandMapRef.commandMapRef, CommandMap.commandMap)
  await Workbench.startup(Platform.getPlatform(), AssetDir.assetDir)
}

main()
