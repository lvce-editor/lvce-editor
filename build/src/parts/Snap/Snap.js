import * as Exec from '../Exec/Exec.js'
import * as Path from '../Path/Path.js'
import * as Product from '../Product/Product.js'
import * as Template from '../Template/Template.js'
import * as Copy from '../Copy/Copy.js'

// TODO get rid of no-sandbox somehow https://github.com/electron/electron/issues/17972

const getSnapArch = (arch) => {
  switch (arch) {
    case 'x64':
      return 'amd64'
    default:
      throw new Error(`unsupported arch "${arch}"`)
  }
}

const copyMetaFiles = async (arch) => {
  const snapArch = getSnapArch(arch)
  await Template.write(
    'linux_snapcraft_yaml',
    `build/.tmp/linux/snap/${arch}/snap/snapcraft.yaml`,
    {
      '@@NAME@@': Product.applicationName,
      '@@VERSION@@': Product.version,
      '@@ARCHITECTURE@@': snapArch,
      '@@SUMMARY@@': Product.linuxSummary,
      '@@SOURCE_CODE@@': Product.repoUrl,
      '@@LICENSE@@': Product.licenseName,
    }
  )
  // TODO vscode has an electron launch file (not yet sure if that is needed)
  await Template.write(
    'linux_desktop',
    `build/.tmp/linux/snap/${arch}/snap/gui/${Product.applicationName}.desktop`,
    {
      '@@NAME_LONG@@': Product.nameLong,
      '@@NAME_SHORT@@': Product.nameShort,
      '@@NAME@@': Product.applicationName,
      '@@EXEC@@': Product.applicationName,
      '@@ICON@@': `\${SNAP}/meta/gui/${Product.applicationName}.png`,
      '@@URLPROTOCOL@@': Product.applicationName,
      '@@SUMMARY@@': Product.linuxSummary,
      '@@KEYWORDS@@': `${Product.applicationName};`,
    }
  )
}

const copyCode = async (arch) => {
  // top level
  await Copy.copyFile({
    from: 'lerna.json',
    to: `build/.tmp/linux/snap/${arch}/files/lerna.json`,
  })
  await Copy.copyFile({
    from: 'package.json',
    to: `build/.tmp/linux/snap/${arch}/files/package.json`,
  })
  await Copy.copyFile({
    from: 'package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/package-lock.json`,
  })

  // build
  await Copy.copyFile({
    from: 'build/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/build/package.json`,
  })
  await Copy.copyFile({
    from: 'build/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/build/package-lock.json`,
  })
  await Copy.copy({
    from: 'build/src',
    to: `build/.tmp/linux/snap/${arch}/files/build/src`,
  })
  await Copy.copy({
    from: 'build/bin',
    to: `build/.tmp/linux/snap/${arch}/files/build/bin`,
  })

  // extensions
  await Copy.copy({
    from: 'extensions/builtin.language-basics-python/src',
    to: `build/.tmp/linux/snap/${arch}/files/extensions/builtin.language-basics-python/src`,
  })
  await Copy.copy({
    from: 'extensions/builtin.language-basics-javascript/src',
    to: `build/.tmp/linux/snap/${arch}/files/extensions/builtin.language-basics-javascript/src`,
  })
  await Copy.copy({
    from: `extensions/builtin.language-basics-html/src`,
    to: `build/.tmp/linux/snap/${arch}/files/extensions/builtin.language-basics-html/src`,
  })
  await Copy.copy({
    from: `extensions/builtin.language-basics-go/src`,
    to: `build/.tmp/linux/snap/${arch}/files/extensions/builtin.language-basics-go/src`,
  })

  // extension host
  await Copy.copyFile({
    from: 'packages/extension-host/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/extension-host/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/extension-host/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/extension-host/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/extension-host/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/extension-host/src`,
  })

  // main process
  await Copy.copyFile({
    from: 'packages/main-process/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/main-process/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/main-process/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/main-process/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/main-process/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/main-process/src`,
  })

  // renderer process
  await Copy.copyFile({
    from: 'packages/renderer-process/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-process/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/renderer-process/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-process/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/renderer-process/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-process/src`,
  })

  // renderer worker
  await Copy.copyFile({
    from: 'packages/renderer-worker/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-worker/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/renderer-worker/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-worker/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/renderer-worker/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/renderer-worker/src`,
  })

  // shared process
  await Copy.copyFile({
    from: 'packages/shared-process/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/shared-process/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/shared-process/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/shared-process/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/shared-process/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/shared-process/src`,
  })

  // web
  await Copy.copyFile({
    from: 'packages/web/package.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/web/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/web/package-lock.json',
    to: `build/.tmp/linux/snap/${arch}/files/packages/web/package-lock.json`,
  })
  await Copy.copy({
    from: 'packages/web/src',
    to: `build/.tmp/linux/snap/${arch}/files/packages/web/src`,
  })
}

const copyExtensions = async (arch) => {}

const createSnap = async (arch) => {
  if (process.env.SKIP_SNAP) {
    return
  }
  await Exec.exec('snapcraft', [], {
    cwd: Path.absolute(`build/.tmp/linux/snap/${arch}`),
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
    },
  })
}

const printSnapSize = async (arch) => {
  const Stat = await import('../Stat/Stat.js')
  const snapArch = getSnapArch(arch)
  const size = await Stat.getFileSize(
    `build/.tmp/linux/snap/${arch}/${Product.applicationName}_${Product.version}_${snapArch}.snap`
  )
  console.info(`snap size: ${size}`)
}

// TODO automatically run bundleCode if not exists

export const build = async () => {
  const arch = 'x64'

  console.time('copyMetaFiles')
  await copyMetaFiles(arch)
  console.timeEnd('copyMetaFiles')

  console.time('copyCode')
  await copyCode(arch)
  console.timeEnd('copyCode')

  console.time('createSnap')
  await createSnap(arch)
  console.timeEnd('createSnap')

  await printSnapSize(arch)
}
