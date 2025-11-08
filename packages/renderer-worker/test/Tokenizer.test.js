import { expect, jest, test } from '@jest/globals'
// @ts-ignore
import { mkdtemp, writeFile } from 'node:fs/promises'
// @ts-ignore
import { tmpdir } from 'node:os'
// @ts-ignore
import { join } from 'node:path'
import * as Tokenizer from '../src/parts/Tokenizer/Tokenizer.js'
import * as TokenizerState from '../src/parts/TokenizerState/TokenizerState.js'

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
export const TokenMap = {}`,
  )
  await writeFile(join(temporaryDir, 'package.json'), '{ "type": "module" }')
  TokenizerState.set(id, tokenizePath)
  await Tokenizer.loadTokenizer(id)
  expect(TokenizerState.get(id)).toMatchObject({
    tokenizeLine: expect.any(Function),
    TokenMap: expect.any(Object),
  })
})

test('loadTokenizer - fallback', async () => {
  TokenizerState.set('test', undefined)
  await Tokenizer.loadTokenizer('test')
  expect(TokenizerState.get('test')).not.toBeDefined()
})

// TODO failing for some reason
test.skip('loadTokenizer - module not found', async () => {
  const id = getId()
  // @ts-ignore
  Tokenizer.state.tokenizePaths[id] = '/abc'
  const spy = jest.spyOn(console, 'error')
  await Tokenizer.loadTokenizer(id)
  expect(spy).toHaveBeenCalledWith(new Error("Cannot find module '/abc' from 'src/parts/Editor/Tokenizer.js'"))
  spy.mockRestore()
})

test.skip('loadTokenizer - immediate error', async () => {
  const temporaryDir = await getTemporaryDir()
  const id = getId()
  const tokenizePath = join(temporaryDir, 'tokenize.js')
  await writeFile(tokenizePath, 'throw new TypeError("oops")')
  await writeFile(join(temporaryDir, 'package.json'), '{ "type": "module" }')
  TokenizerState.set(id, tokenizePath)
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
  // @ts-ignore
  Tokenizer.state.tokenizePaths[id] = tokenizePath
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await Tokenizer.loadTokenizer(id)
  expect(spy).toHaveBeenCalledWith(`tokenizer.tokenizeLine should be a function in \"${tokenizePath}\"`)
  spy.mockRestore()
})

test.skip('loadTokenizer - TokenMap should be an Object', async () => {
  const temporaryDir = await getTemporaryDir()
  const id = getId()
  const tokenizePath = join(temporaryDir, 'tokenize.js')
  await writeFile(
    tokenizePath,
    `export const tokenizeLine = () => {}
export const TokenMap = 2`,
  )
  await writeFile(join(temporaryDir, 'package.json'), '{ "type": "module" }')
  TokenizerState.set(id, tokenizePath)
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await Tokenizer.loadTokenizer(id)
  expect(spy).toHaveBeenCalledWith(`tokenizer.TokenMap should be an object in \"${tokenizePath}\"`)
  spy.mockRestore()
})
