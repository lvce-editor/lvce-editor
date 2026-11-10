const hostReady = Promise.withResolvers<void>()

export const markHostReady = (): void => hostReady.resolve()

export const waitForHost = (): Promise<void> => hostReady.promise
