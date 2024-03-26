interface WithResolvers<T> {
  readonly resolve: (value: T) => void
  readonly promise: Promise<T>
}

export const withResolvers = <T>(): WithResolvers<T> => {
  let _resolve: (value: T) => void
  const promise = new Promise<T>((resolve) => {
    _resolve = resolve
  })
  return {
    resolve: _resolve!,
    promise,
  }
}
