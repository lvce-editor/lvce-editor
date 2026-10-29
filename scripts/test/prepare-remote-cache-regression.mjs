import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'

// The released-runtime fixture predates this frontend's top-level Terminal
// menu. Keep its real menu click scoped to the open View menu.
const path = '.tmp/remote-account-tests/packages/e2e/scripts/run-remote-web.js'
const source = await readFile(path, 'utf8')
const original = "await page.getByRole('menuitem', { name: 'Terminal', exact: true }).click()"
assert.equal(source.split(original).length, 2, 'Expected one unscoped terminal menu lookup')
await writeFile(path, source.replace(original, "await page.getByRole('menu').getByRole('menuitem', { name: 'Terminal', exact: true }).click()"))
