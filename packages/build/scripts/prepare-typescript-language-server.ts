import { bundleTypeScriptLanguageServer } from '../src/parts/BundleTypeScriptLanguageServer/BundleTypeScriptLanguageServer.ts'
import * as Path from '../src/parts/Path/Path.ts'

await bundleTypeScriptLanguageServer({
  arch: process.arch,
  platform: process.platform,
  to: Path.absolute('packages/shared-process/language-servers/typescript'),
})
