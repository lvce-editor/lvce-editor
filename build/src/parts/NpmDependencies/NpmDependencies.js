import * as Exec from '../Exec/Exec.js'
import * as Path from '../Path/Path.js'

export const getNpmDependencies = async (root) => {
  const absoluteRoot = Path.absolute(root)
  const { stdout } = await Exec.exec(
    'npm',
    ['list', '--omit=dev', '--parseable', '--all'],
    {
      cwd: absoluteRoot,
    }
  )
  const lines = stdout.split('\n')
  return lines.slice(1)
}
