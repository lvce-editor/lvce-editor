const getConstructorName = (value) => {
  return value?.constructor?.name || 'Object'
}

const serializeError = (error) => {
  return {
    $type: getConstructorName(error),
    message: error.message,
    name: error.name,
    stack: error.stack,
  }
}

const serializeValue = (value, seen, nextReference) => {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return value
  }
  if (typeof value === 'bigint') {
    return { $type: 'BigInt', value: String(value) }
  }
  if (typeof value === 'undefined') {
    return { $type: 'Undefined' }
  }
  if (typeof value === 'function' || typeof value === 'symbol') {
    return { $type: getConstructorName(value), value: String(value) }
  }
  if (value instanceof Error) {
    return serializeError(value)
  }
  if (typeof MessagePort !== 'undefined' && value instanceof MessagePort) {
    return { $type: 'MessagePort' }
  }
  if (value instanceof ArrayBuffer) {
    return { $type: 'ArrayBuffer', byteLength: value.byteLength }
  }
  if (ArrayBuffer.isView(value)) {
    const length = 'length' in value && typeof value.length === 'number' ? value.length : undefined
    return {
      $type: getConstructorName(value),
      byteLength: value.byteLength,
      length,
    }
  }
  if (value instanceof Date) {
    return { $type: 'Date', value: value.toISOString() }
  }
  const existingReference = seen.get(value)
  if (existingReference !== undefined) {
    return { $ref: existingReference }
  }
  const reference = nextReference.value++
  seen.set(value, reference)
  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item, seen, nextReference))
  }
  const result = {}
  for (const key of Object.keys(value)) {
    try {
      result[key] = serializeValue(value[key], seen, nextReference)
    } catch (error) {
      result[key] = {
        $type: 'SerializationError',
        message: error instanceof Error ? error.message : String(error),
      }
    }
  }
  const constructorName = getConstructorName(value)
  if (constructorName !== 'Object') {
    result.$type = constructorName
  }
  return result
}

export const serializeIpcTraceMessage = (value) => {
  return serializeValue(value, new WeakMap(), { value: 1 })
}
