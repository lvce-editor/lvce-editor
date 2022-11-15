// based on ublock's json-prune function

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
    apply() {
      return prune(Reflect.apply(...arguments))
    },
  })

  Response.prototype.json = new Proxy(Response.prototype.json, {
    apply() {
      return Reflect.apply(...arguments).then(prune)
    },
  })
})()
