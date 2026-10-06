import * as Path from '../src/parts/Path/Path.ts'
import * as ExportStaticSite from '../src/parts/ExportStaticSite/ExportStaticSite.ts'

await ExportStaticSite.exportStaticSite({
  root: Path.absolute('packages/build/.tmp/pages-export'),
  serverRoot: Path.absolute('packages/build/.tmp/server'),
})
