import { VError } from '@lvce-editor/verror'
import * as Exec from '../Exec/Exec.js'
import * as Path from '../Path/Path.js'

export const createSnap = async (arch) => {
  try {
    if (process.env.SKIP_SNAP) {
      return
    }
    await Exec.exec('snapcraft', [], {
      cwd: Path.absolute(`packages/build/.tmp/linux/snap/${arch}`),
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
      },
    })
  } catch (error) {
    // @ts-ignore
    if (error && error.exitCode === 127) {
      throw new VError(`Failed to create snap: snapcraft is not installed`)
    }
    throw new VError(error, `Failed to create snap`)
  }
}
