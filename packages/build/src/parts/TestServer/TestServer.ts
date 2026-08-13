import assert from 'node:assert/strict'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Copy from '../Copy/Copy.ts'
import * as Path from '../Path/Path.ts'

const wait = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const getFreePort = async (): Promise<number> => {
  const server = createServer()
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  if (!address || typeof address === 'string') {
    server.close()
    throw new Error('Failed to allocate a test server port')
  }
  const { port } = address
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
  return port
}

const waitForListening = async (child: ChildProcessWithoutNullStreams): Promise<void> => {
  return new Promise((resolve, reject) => {
    let output = ''
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for built server startup\n${output}`))
    }, 30_000)
    const handleData = (chunk: Buffer): void => {
      output += chunk.toString()
      if (output.includes('listening on')) {
        clearTimeout(timeout)
        resolve()
      }
    }
    child.stdout.on('data', handleData)
    child.stderr.on('data', handleData)
    child.once('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    child.once('exit', (code) => {
      clearTimeout(timeout)
      reject(new Error(`Built server exited before startup with code ${code}\n${output}`))
    })
  })
}

const stopServer = async (child: ChildProcessWithoutNullStreams): Promise<void> => {
  if (child.exitCode !== null || child.signalCode !== null) {
    return
  }
  const exited = new Promise<void>((resolve) => child.once('exit', () => resolve()))
  child.kill()
  await Promise.race([exited, wait(5_000)])
  if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL')
  }
}

const main = async (): Promise<void> => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'lvce-built-server-'))
  let child: ChildProcessWithoutNullStreams | undefined
  try {
    const packageRoot = join(temporaryDirectory, 'node_modules', '@lvce-editor')
    await Copy.copy({
      from: Path.absolute('packages/build/.tmp/server'),
      to: packageRoot,
    })

    const serverRoot = join(packageRoot, 'server')
    const staticServerRoot = join(packageRoot, 'static-server')
    const config = JSON.parse(await readFile(join(staticServerRoot, 'config.json'), 'utf8'))
    const expectedHeaders = config.headers[config.files['/']]
    const expectedContent = await readFile(join(staticServerRoot, 'static', 'index.html'), 'utf8')
    const port = await getFreePort()
    const serverProcess = spawn(process.execPath, [join(serverRoot, 'bin', 'server.js'), temporaryDirectory], {
      cwd: serverRoot,
      env: {
        ...process.env,
        PORT: `${port}`,
      },
      stdio: 'pipe',
    })
    child = serverProcess
    await waitForListening(serverProcess)

    for (const path of ['/', '/?workspace=/test', '/index.html', '/index.html?workspace=/test']) {
      const response = await fetch(`http://localhost:${port}${path}`)
      assert.equal(response.status, 200)
      assert.equal(await response.text(), expectedContent)
      assert.equal(response.headers.get('content-security-policy'), expectedHeaders['Content-Security-Policy'])
      assert.equal(response.headers.get('cross-origin-embedder-policy'), expectedHeaders['Cross-Origin-Embedder-Policy'])
      assert.equal(response.headers.get('cross-origin-opener-policy'), expectedHeaders['Cross-Origin-Opener-Policy'])
      assert.equal(response.headers.get('cross-origin-resource-policy'), expectedHeaders['Cross-Origin-Resource-Policy'])
    }
  } finally {
    if (child) {
      await stopServer(child)
    }
    await rm(temporaryDirectory, { recursive: true, force: true })
  }
}

await main()
