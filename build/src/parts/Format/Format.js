import * as FormatCommands from '../FormatCommands/FormatCommands.js'
import * as FormatModuleFiles from '../FormatModuleFiles/FormatModuleFiles.js'
import * as FormatModuleIds from '../FormatModuleIds/FormatModuleIds.js'
import * as FormatModuleMaps from '../FormatModuleMaps/FormatModuleMaps.js'
import * as FormatViewletModuleIds from '../FormatViewletModuleIds/FormatViewletModuleIds.js'
import * as FormatBuiltinExtensions from '../FormatBuiltinExtensions/FormatBuiltinExtensions.js'

const main = async () => {
  await FormatBuiltinExtensions.formatBuiltinExtensions()
  await FormatCommands.formatAllCommands()
  await FormatModuleFiles.formatAllModuleFiles()
  await FormatModuleIds.formatAllModuleIds()
  await FormatModuleMaps.formatAllModuleMaps()
  await FormatViewletModuleIds.formatAllViewletModuleIds()
}

main()
