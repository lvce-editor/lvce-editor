import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { jest } from '@jest/globals'
import * as Tokenizer from '../src/parts/Tokenizer/Tokenizer.js'

const getTemporaryDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const getId = () => {
  return `test-${Math.random()}`
}

test.skip('loadTokenizer', async () => {
  const temporaryDir = await getTemporaryDir()
  const id = getId()
  const tokenizePath = join(temporaryDir, 'tokenize.js')
  await writeFile(
    tokenizePath,
    `export const tokenizeLine = () => {}
export const TokenMap = {}`
  )
  await writeFile(join(temporaryDir, 'package.json'), '{ "type": "module" }')
  Tokenizer.state.tokenizePaths[id] = tokenizePath
  await Tokenizer.loadTokenizer(id)
  expect(Tokenizer.state.tokenizers[id]).toMatchObject({
    tokenizeLine: expect.any(Function),
    TokenMap: expect.any(Object),
  })
})

test('loadTokenizer - fallback', async () => {
  delete Tokenizer.state.tokenizePaths.test
  await Tokenizer.loadTokenizer('test')
  expect(Tokenizer.state.tokenizers.test).not.toBeDefined()
})

// TODO failing for some reason
test.skip('loadTokenizer - module not found', async () => {
  const id = getId()
  Tokenizer.state.tokenizePaths[id] = '/abc'
  const spy = jest.spyOn(console, 'error')
  await Tokenizer.loadTokenizer(id)
  expect(spy).toHaveBeenCalledWith(
    new Error('Cannot find module \'/abc\' from \'src/parts/Editor/Tokenizer.js\'')
  )
  spy.mockRestore()
})

test.skip('loadTokenizer - immediate error', async () => {
  const temporaryDir = await getTemporaryDir()
  const id = getId()
  const tokenizePath = join(temporaryDir, 'tokenize.js')
  await writeFile(tokenizePath, 'throw new TypeError("oops")')
  await writeFile(join(temporaryDir, 'package.json'), '{ "type": "module" }')
  Tokenizer.state.tokenizePaths[id] = tokenizePath
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await Tokenizer.loadTokenizer(id)
  expect(spy).toHaveBeenCalledWith(new TypeError('oops'))
  spy.mockRestore()
})

test.skip('loadTokenizer - tokenizeLine is not a function', async () => {
  const temporaryDir = await getTemporaryDir()
  const id = getId()
  const tokenizePath = join(temporaryDir, 'tokenize.js')
  await writeFile(tokenizePath, 'export const tokenizeLine = 2')
  await writeFile(join(temporaryDir, 'package.json'), '{ "type": "module" }')
  Tokenizer.state.tokenizePaths[id] = tokenizePath
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await Tokenizer.loadTokenizer(id)
  expect(spy).toHaveBeenCalledWith(
    `tokenizer.tokenizeLine should be a function in \"${tokenizePath}\"`
  )
  spy.mockRestore()
})

test.skip('loadTokenizer - TokenMap should be an Object', async () => {
  const temporaryDir = await getTemporaryDir()
  const id = getId()
  const tokenizePath = join(temporaryDir, 'tokenize.js')
  await writeFile(
    tokenizePath,
    `export const tokenizeLine = () => {}
export const TokenMap = 2`
  )
  await writeFile(join(temporaryDir, 'package.json'), '{ "type": "module" }')
  Tokenizer.state.tokenizePaths[id] = tokenizePath
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await Tokenizer.loadTokenizer(id)
  expect(spy).toHaveBeenCalledWith(
    `tokenizer.TokenMap should be an object in \"${tokenizePath}\"`
  )
  spy.mockRestore()
})
