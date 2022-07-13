import * as Validation from '../src/parts/Validation/Validation.js'

test('validate - item must be of type object but is of type function', () => {
  const item = () => {}
  const shape = {
    type: 'object',
  }
  expect(Validation.validate(item, shape)).toBe(
    `item must be of type object but is () => {}`
  )
})

test('validate - item must be of type object but is of type array', () => {
  const item = []
  const shape = {
    type: 'object',
  }
  expect(Validation.validate(item, shape)).toBe(
    `item must be of type object but is []`
  )
})

test('validate - object property must be of type string but is of type object', () => {
  const item = {
    uri: {},
  }
  const shape = {
    type: 'object',
    properties: {
      uri: {
        type: 'string',
      },
    },
  }
  expect(Validation.validate(item, shape)).toBe(
    `item.uri must be of type string`
  )
})

test('validate - object property must be of type number but is missing', () => {
  const item = {}
  const shape = {
    type: 'object',
    properties: {
      endOffset: {
        type: 'number',
      },
    },
  }
  expect(Validation.validate(item, shape)).toBe(
    `item.endOffset must be of type number`
  )
})
