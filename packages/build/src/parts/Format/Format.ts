import * as FormatBuiltinExtensions from '../FormatBuiltinExtensions/FormatBuiltinExtensions.ts'
import * as FormatCommands from '../FormatCommands/FormatCommands.ts'
import * as FormatModuleFiles from '../FormatModuleFiles/FormatModuleFiles.ts'
import * as FormatModuleIds from '../FormatModuleIds/FormatModuleIds.ts'
import * as FormatModuleMaps from '../FormatModuleMaps/FormatModuleMaps.ts'
import * as FormatViewletModuleIds from '../FormatViewletModuleIds/FormatViewletModuleIds.ts'
import * as FormatViewletModules from '../FormatViewletModules/FormatViewletModules.ts'

const main = async () => {
  await FormatBuiltinExtensions.formatBuiltinExtensions()
  await FormatCommands.formatAllCommands()
  await FormatModuleFiles.formatAllModuleFiles()
  await FormatModuleIds.formatAllModuleIds()
  await FormatModuleMaps.formatAllModuleMaps()
  await FormatViewletModuleIds.formatAllViewletModuleIds()
  await FormatViewletModules.formatAllViewletModules()
}

main()
