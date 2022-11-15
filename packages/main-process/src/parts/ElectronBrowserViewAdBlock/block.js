;(() => {
  const removeKeys = ['playerAds', 'adPlacements']

  const prune = (json) => {
    if (typeof json !== 'object' || json === null) {
      return json
    }
    if (Array.isArray(json)) {
      for (const value of json) {
        prune(value)
      }
      return json
    }
    for (const removeKey of removeKeys) {
      if (Object.hasOwn(json, removeKey)) {
        json[removeKey] = []
      }
    }
    return json
  }

  JSON.parse = new Proxy(JSON.parse, {
    apply(...args) {
      return prune(Reflect.apply(...args))
    },
  })

  // @ts-ignore
  Response.prototype.json = new Proxy(Response.prototype.json, {
    async apply(...args) {
      const json = await Reflect.apply(...args)
      return prune(json)
    },
  })
})()
