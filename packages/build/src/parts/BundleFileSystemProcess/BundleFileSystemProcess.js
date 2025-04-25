import { join } from 'path'
import * as Replace from '../Replace/Replace.js'

export const bundleFileSystemProcess = async ({ to }) => {
  const fileSystemProcessPath = join(to, 'node_modules', '@lvce-editor', 'file-system-process', 'dist', 'index.js')
  await Replace.replace({
    path: fileSystemProcessPath,
    occurrence: `import _trash from 'trash';\n`,
    replacement: '',
  })
  await Replace.replace({
    path: fileSystemProcessPath,
    occurrence: `const trash$1 = async path => {
  await _trash(path);
};`,
    replacement: '',
  })
  await Replace.replace({
    path: fileSystemProcessPath,
    occurrence: `const getFn = () => {
  if (isElectron) {
    return trash$2;
  }
  return trash$1;
};`,
    replacement: `const getFn = () => {
  return trash$2;
};`,
  })
}
