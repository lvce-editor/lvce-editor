import * as ArchType from '../ArchType/ArchType.js'
import * as Copy from '../Copy/Copy.js'
import * as Exec from '../Exec/Exec.js'
import * as Path from '../Path/Path.js'
import * as Template from '../Template/Template.js'

const getRpmArch = (arch) => {
  switch (arch) {
    case ArchType.X64:
      return 'x86_64'
    case 'armhf':
      return 'armv7hl'
    case 'arm64':
      return 'aarch64'
    default:
      throw new Error(`unsupported arch "${arch}"`)
  }
}

const copyMetaFiles = async ({ arch, product }) => {
  const rpmArch = getRpmArch(arch)
  await Template.write('linux_desktop', `build/.tmp/linux/rpm/${rpmArch}/rpmbuild/BUILD/usr/share/applications/${product.applicationName}.desktop`, {
    '@@NAME_LONG@@': product.nameLong,
    '@@NAME_SHORT@@': product.nameShort,
    '@@NAME@@': product.applicationName,
    '@@EXEC@@': product.applicationName,
    '@@ICON@@': product.applicationName,
    '@@URLPROTOCOL@@': product.applicationName,
    '@@SUMMARY@@': product.linuxSummary,
    '@@KEYWORDS@@': `${product.applicationName};`,
  })
  await Template.write(
    'linux_app_data_xml',
    `build/.tmp/linux/rpm/${rpmArch}/rpmbuild/BUILD/usr/share/appdata/${product.applicationName}.appdata.xml`,
    {
      '@@NAME_LONG@@': product.nameLong,
      '@@NAME@@': product.applicationName,
      '@@LICENSE@@': product.licenseName,
      '@@HOMEPAGE@@': product.homePage,
      '@@SUMMARY@@': product.linuxSummary,
    }
  )
  await Copy.copyFile({
    from: 'build/files/icon.png',
    to: `build/.tmp/linux/rpm/${rpmArch}/rpmbuild/${product.applicationName}/usr/share/pixmaps/${product.applicationName}.png`,
  })
}

const createRpm = async ({ arch, product }) => {
  const rpmArch = getRpmArch(arch)
  const cwd = Path.absolute(`build/.tmp/linux/rpm/${rpmArch}/rpmbuild`)
  const rpmBuildPath = Path.absolute(`build/.tmp/linux/rpm/${rpmArch}/rpmbuild`)
  const rpmOut = Path.absolute(`build/.tmp/linux/rpm/${rpmArch}/rpmbuild/RPMS/${rpmArch}`)
  const destination = Path.absolute(`build/.tmp/linux/rpm/${rpmArch}`)
  const specPath = Path.absolute(`build/.tmp/linux/rpm/${rpmArch}/rpmbuild/SPECS/${product.applicationName}.spec`)
  await Exec.exec('fakeroot', [`rpmbuild --bb ${specPath} --target=${rpmArch}`], {
    env: {
      HOME: destination,
    },
  })
}

export const build = async ({ product }) => {
  const arch = 'x64'

  console.time('copyMetaFiles')
  await copyMetaFiles({ arch, product })
  console.timeEnd('copyMetaFiles')

  console.time('createRpm')
  await createRpm({ arch, product })
  console.timeEnd('createRpm')
}
