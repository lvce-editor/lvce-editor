import assert from 'node:assert/strict'
import { cp, readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

// Match remote-ssh's existing full browser fixture: Git runs through the remote
// transport, and the selected icon theme must have its assets. Keep the built
// renderer and released remote connectors intact in a separate test frontend.
const source = resolve('packages/build/.tmp/dist')
const target = resolve('.tmp/remote-account-frontend')
await cp(source, target, { recursive: true })
const roots = []
for (const entry of await readdir(target, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const config = join(target, entry.name, 'config/webExtensions.json')
  try {
    roots.push({ directory: join(target, entry.name), config, entries: JSON.parse(await readFile(config, 'utf8')) })
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}
assert.equal(roots.length, 1, 'Expected one built frontend')
const { directory, entries } = roots[0]
for (const id of ['builtin.git', 'builtin.vscode-icons']) {
  await cp(resolve('extensions', id), join(directory, 'extensions', id), { recursive: true })
}
const manifest = JSON.parse(await readFile('extensions/builtin.git/extension.json', 'utf8'))
assert.equal(manifest.id, 'builtin.git')
assert.ok(manifest.browser, 'Git must support the browser remote transport')
const remote = entries.find((entry) => entry.id === 'builtin.remote-server')
assert.ok(remote?.path, 'Released remote connector must be bundled')
for (const file of ['extensions.json', 'webExtensions.json']) {
  const configFile = join(directory, 'config', file)
  const contributions = JSON.parse(await readFile(configFile, 'utf8'))
  await writeFile(
    configFile,
    JSON.stringify(
      [
        ...contributions.filter((entry) => entry.id !== manifest.id),
        { ...manifest, ...(file === 'webExtensions.json' ? { isWeb: true } : {}), path: remote.path.replace(/builtin\.remote-server$/, manifest.id) },
      ],
      null,
      2,
    ) + '\n',
  )
}
