// @ts-nocheck
var __defProp = Object.defineProperty;
var __publicField = (obj, key, value) => {
  if (typeof key !== "symbol")
    key += "";
  if (key in obj)
    return __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value});
  return obj[key] = value;
};
class HTTPError extends Error {
  constructor(response, request, options) {
    __publicField(this, "response");
    __publicField(this, "request");
    __publicField(this, "options");
    const code = response.status || response.status === 0 ? response.status : "";
    const title = response.statusText || "";
    const status = `${code} ${title}`.trim();
    const reason = status ? `status code ${status}` : "an unknown error";
    super(`Request failed with ${reason}: ${request.method} ${request.url}`);
    this.name = "HTTPError";
    this.response = response;
    this.request = request;
    this.options = options;
  }
}
class TimeoutError extends Error {
  constructor(request) {
    super(`Request timed out: ${request.method} ${request.url}`);
    __publicField(this, "request");
    this.name = "TimeoutError";
    this.request = request;
  }
}
const isObject = (value) => value !== null && typeof value === "object";
const validateAndMerge = (...sources) => {
  for (const source of sources) {
    if ((!isObject(source) || Array.isArray(source)) && source !== void 0) {
      throw new TypeError("The `options` argument must be an object");
    }
  }
  return deepMerge({}, ...sources);
};
const mergeHeaders = (source1 = {}, source2 = {}) => {
  const result = new globalThis.Headers(source1);
  const isHeadersInstance = source2 instanceof globalThis.Headers;
  const source = new globalThis.Headers(source2);
  for (const [key, value] of source.entries()) {
    if (isHeadersInstance && value === "undefined" || value === void 0) {
      result.delete(key);
    } else {
      result.set(key, value);
    }
  }
  return result;
};
function newHookValue(original, incoming, property) {
  var _a, _b;
  return Object.hasOwn(incoming, property) && incoming[property] === void 0 ? [] : deepMerge((_a = original[property]) != null ? _a : [], (_b = incoming[property]) != null ? _b : []);
}
const mergeHooks = (original = {}, incoming = {}) => ({
  beforeRequest: newHookValue(original, incoming, "beforeRequest"),
  beforeRetry: newHookValue(original, incoming, "beforeRetry"),
  afterResponse: newHookValue(original, incoming, "afterResponse"),
  beforeError: newHookValue(original, incoming, "beforeError")
});
const deepMerge = (...sources) => {
  let returnValue = {};
  let headers = {};
  let hooks = {};
  for (const source of sources) {
    if (Array.isArray(source)) {
      if (!Array.isArray(returnValue)) {
        returnValue = [];
      }
      returnValue = [...returnValue, ...source];
    } else if (isObject(source)) {
      for (let [key, value] of Object.entries(source)) {
        if (isObject(value) && key in returnValue) {
          value = deepMerge(returnValue[key], value);
        }
        returnValue = {...returnValue, [key]: value};
      }
      if (isObject(source.hooks)) {
        hooks = mergeHooks(hooks, source.hooks);
        returnValue.hooks = hooks;
      }
      if (isObject(source.headers)) {
        headers = mergeHeaders(headers, source.headers);
        returnValue.headers = headers;
      }
    }
  }
  return returnValue;
};
const supportsRequestStreams = (() => {
  let duplexAccessed = false;
  let hasContentType = false;
  const supportsReadableStream = typeof globalThis.ReadableStream === "function";
  const supportsRequest = typeof globalThis.Request === "function";
  if (supportsReadableStream && supportsRequest) {
    try {
      hasContentType = new globalThis.Request("https://empty.invalid", {
        body: new globalThis.ReadableStream(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
    } catch (error) {
      if (error instanceof Error && error.message === "unsupported BodyInit type") {
        return false;
      }
      throw error;
    }
  }
  return duplexAccessed && !hasContentType;
})();
const supportsAbortController = typeof globalThis.AbortController === "function";
const supportsResponseStreams = typeof globalThis.ReadableStream === "function";
const supportsFormData = typeof globalThis.FormData === "function";
const requestMethods = ["get", "post", "put", "patch", "head", "delete"];
const responseTypes = {
  json: "application/json",
  text: "text/*",
  formData: "multipart/form-data",
  arrayBuffer: "*/*",
  blob: "*/*"
};
const maxSafeTimeout = 2147483647;
const stop = Symbol("stop");
const kyOptionKeys = {
  json: true,
  parseJson: true,
  stringifyJson: true,
  searchParams: true,
  prefixUrl: true,
  retry: true,
  timeout: true,
  hooks: true,
  throwHttpErrors: true,
  onDownloadProgress: true,
  fetch: true
};
const requestOptionsRegistry = {
  method: true,
  headers: true,
  body: true,
  mode: true,
  credentials: true,
  cache: true,
  redirect: true,
  referrer: true,
  referrerPolicy: true,
  integrity: true,
  keepalive: true,
  signal: true,
  window: true,
  dispatcher: true,
  duplex: true,
  priority: true
};
const normalizeRequestMethod = (input) => requestMethods.includes(input) ? input.toUpperCase() : input;
const retryMethods = ["get", "put", "head", "delete", "options", "trace"];
const retryStatusCodes = [408, 413, 429, 500, 502, 503, 504];
const retryAfterStatusCodes = [413, 429, 503];
const defaultRetryOptions = {
  limit: 2,
  methods: retryMethods,
  statusCodes: retryStatusCodes,
  afterStatusCodes: retryAfterStatusCodes,
  maxRetryAfter: Number.POSITIVE_INFINITY,
  backoffLimit: Number.POSITIVE_INFINITY,
  delay: (attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1e3
};
const normalizeRetryOptions = (retry = {}) => {
  if (typeof retry === "number") {
    return {
      ...defaultRetryOptions,
      limit: retry
    };
  }
  if (retry.methods && !Array.isArray(retry.methods)) {
    throw new Error("retry.methods must be an array");
  }
  if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
    throw new Error("retry.statusCodes must be an array");
  }
  return {
    ...defaultRetryOptions,
    ...retry
  };
};
async function timeout(request, init, abortController, options) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (abortController) {
        abortController.abort();
      }
      reject(new TimeoutError(request));
    }, options.timeout);
    void options.fetch(request, init).then(resolve).catch(reject).then(() => {
      clearTimeout(timeoutId);
    });
  });
}
async function delay(ms, {signal}) {
  return new Promise((resolve, reject) => {
    if (signal) {
      signal.throwIfAborted();
      signal.addEventListener("abort", abortHandler, {once: true});
    }
    function abortHandler() {
      clearTimeout(timeoutId);
      reject(signal.reason);
    }
    const timeoutId = setTimeout(() => {
      signal == null ? void 0 : signal.removeEventListener("abort", abortHandler);
      resolve();
    }, ms);
  });
}
const findUnknownOptions = (request, options) => {
  const unknownOptions = {};
  for (const key in options) {
    if (!(key in requestOptionsRegistry) && !(key in kyOptionKeys) && !(key in request)) {
      unknownOptions[key] = options[key];
    }
  }
  return unknownOptions;
};
class Ky {
  constructor(input, options = {}) {
    __publicField(this, "request");
    __publicField(this, "abortController");
    __publicField(this, "_retryCount", 0);
    __publicField(this, "_input");
    __publicField(this, "_options");
    var _a, _b, _c, _d, _e, _f, _g, _h;
    this._input = input;
    this._options = {
      ...options,
      headers: mergeHeaders(this._input.headers, options.headers),
      hooks: mergeHooks({
        beforeRequest: [],
        beforeRetry: [],
        beforeError: [],
        afterResponse: []
      }, options.hooks),
      method: normalizeRequestMethod((_a = options.method) != null ? _a : this._input.method),
      prefixUrl: String(options.prefixUrl || ""),
      retry: normalizeRetryOptions(options.retry),
      throwHttpErrors: options.throwHttpErrors !== false,
      timeout: (_b = options.timeout) != null ? _b : 1e4,
      fetch: (_c = options.fetch) != null ? _c : globalThis.fetch.bind(globalThis)
    };
    if (typeof this._input !== "string" && !(this._input instanceof URL || this._input instanceof globalThis.Request)) {
      throw new TypeError("`input` must be a string, URL, or Request");
    }
    if (this._options.prefixUrl && typeof this._input === "string") {
      if (this._input.startsWith("/")) {
        throw new Error("`input` must not begin with a slash when using `prefixUrl`");
      }
      if (!this._options.prefixUrl.endsWith("/")) {
        this._options.prefixUrl += "/";
      }
      this._input = this._options.prefixUrl + this._input;
    }
    if (supportsAbortController) {
      this.abortController = new globalThis.AbortController();
      const originalSignal = (_d = this._options.signal) != null ? _d : this._input.signal;
      originalSignal == null ? void 0 : originalSignal.addEventListener("abort", () => {
        this.abortController.abort(originalSignal.reason);
      });
      this._options.signal = this.abortController.signal;
    }
    if (supportsRequestStreams) {
      this._options.duplex = "half";
    }
    if (this._options.json !== void 0) {
      this._options.body = (_g = (_f = (_e = this._options).stringifyJson) == null ? void 0 : _f.call(_e, this._options.json)) != null ? _g : JSON.stringify(this._options.json);
      this._options.headers.set("content-type", (_h = this._options.headers.get("content-type")) != null ? _h : "application/json");
    }
    this.request = new globalThis.Request(this._input, this._options);
    if (this._options.searchParams) {
      const textSearchParams = typeof this._options.searchParams === "string" ? this._options.searchParams.replace(/^\?/, "") : new URLSearchParams(this._options.searchParams).toString();
      const searchParams = "?" + textSearchParams;
      const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
      if ((supportsFormData && this._options.body instanceof globalThis.FormData || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers["content-type"])) {
        this.request.headers.delete("content-type");
      }
      this.request = new globalThis.Request(new globalThis.Request(url, {...this.request}), this._options);
    }
  }
  static create(input, options) {
    const ky2 = new Ky(input, options);
    const function_ = async () => {
      if (typeof ky2._options.timeout === "number" && ky2._options.timeout > maxSafeTimeout) {
        throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
      }
      await Promise.resolve();
      let response = await ky2._fetch();
      for (const hook of ky2._options.hooks.afterResponse) {
        const modifiedResponse = await hook(ky2.request, ky2._options, ky2._decorateResponse(response.clone()));
        if (modifiedResponse instanceof globalThis.Response) {
          response = modifiedResponse;
        }
      }
      ky2._decorateResponse(response);
      if (!response.ok && ky2._options.throwHttpErrors) {
        let error = new HTTPError(response, ky2.request, ky2._options);
        for (const hook of ky2._options.hooks.beforeError) {
          error = await hook(error);
        }
        throw error;
      }
      if (ky2._options.onDownloadProgress) {
        if (typeof ky2._options.onDownloadProgress !== "function") {
          throw new TypeError("The `onDownloadProgress` option must be a function");
        }
        if (!supportsResponseStreams) {
          throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");
        }
        return ky2._stream(response.clone(), ky2._options.onDownloadProgress);
      }
      return response;
    };
    const isRetriableMethod = ky2._options.retry.methods.includes(ky2.request.method.toLowerCase());
    const result = isRetriableMethod ? ky2._retry(function_) : function_();
    for (const [type, mimeType] of Object.entries(responseTypes)) {
      result[type] = async () => {
        ky2.request.headers.set("accept", ky2.request.headers.get("accept") || mimeType);
        const awaitedResult = await result;
        const response = awaitedResult.clone();
        if (type === "json") {
          if (response.status === 204) {
            return "";
          }
          const arrayBuffer = await response.clone().arrayBuffer();
          const responseSize = arrayBuffer.byteLength;
          if (responseSize === 0) {
            return "";
          }
          if (options.parseJson) {
            return options.parseJson(await response.text());
          }
        }
        return response[type]();
      };
    }
    return result;
  }
  _calculateRetryDelay(error) {
    var _a, _b, _c, _d;
    this._retryCount++;
    if (this._retryCount > this._options.retry.limit || error instanceof TimeoutError) {
      throw error;
    }
    if (error instanceof HTTPError) {
      if (!this._options.retry.statusCodes.includes(error.response.status)) {
        throw error;
      }
      const retryAfter = (_c = (_b = (_a = error.response.headers.get("Retry-After")) != null ? _a : error.response.headers.get("RateLimit-Reset")) != null ? _b : error.response.headers.get("X-RateLimit-Reset")) != null ? _c : error.response.headers.get("X-Rate-Limit-Reset");
      if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
        let after = Number(retryAfter) * 1e3;
        if (Number.isNaN(after)) {
          after = Date.parse(retryAfter) - Date.now();
        } else if (after >= Date.parse("2024-01-01")) {
          after -= Date.now();
        }
        const max = (_d = this._options.retry.maxRetryAfter) != null ? _d : after;
        return after < max ? after : max;
      }
      if (error.response.status === 413) {
        throw error;
      }
    }
    const retryDelay = this._options.retry.delay(this._retryCount);
    return Math.min(this._options.retry.backoffLimit, retryDelay);
  }
  _decorateResponse(response) {
    if (this._options.parseJson) {
      response.json = async () => this._options.parseJson(await response.text());
    }
    return response;
  }
  async _retry(function_) {
    try {
      return await function_();
    } catch (error) {
      const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
      if (this._retryCount < 1) {
        throw error;
      }
      await delay(ms, {signal: this._options.signal});
      for (const hook of this._options.hooks.beforeRetry) {
        const hookResult = await hook({
          request: this.request,
          options: this._options,
          error,
          retryCount: this._retryCount
        });
        if (hookResult === stop) {
          return;
        }
      }
      return this._retry(function_);
    }
  }
  async _fetch() {
    for (const hook of this._options.hooks.beforeRequest) {
      const result = await hook(this.request, this._options);
      if (result instanceof Request) {
        this.request = result;
        break;
      }
      if (result instanceof Response) {
        return result;
      }
    }
    const nonRequestOptions = findUnknownOptions(this.request, this._options);
    const mainRequest = this.request;
    this.request = mainRequest.clone();
    if (this._options.timeout === false) {
      return this._options.fetch(mainRequest, nonRequestOptions);
    }
    return timeout(mainRequest, nonRequestOptions, this.abortController, this._options);
  }
  _stream(response, onDownloadProgress) {
    const totalBytes = Number(response.headers.get("content-length")) || 0;
    let transferredBytes = 0;
    if (response.status === 204) {
      if (onDownloadProgress) {
        onDownloadProgress({percent: 1, totalBytes, transferredBytes}, new Uint8Array());
      }
      return new globalThis.Response(null, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
    return new globalThis.Response(new globalThis.ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        if (onDownloadProgress) {
          onDownloadProgress({percent: 0, transferredBytes: 0, totalBytes}, new Uint8Array());
        }
        async function read() {
          const {done, value} = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          if (onDownloadProgress) {
            transferredBytes += value.byteLength;
            const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
            onDownloadProgress({percent, transferredBytes, totalBytes}, value);
          }
          controller.enqueue(value);
          await read();
        }
        await read();
      }
    }), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }
}
/*! MIT License © Sindre Sorhus */
const createInstance = (defaults) => {
  const ky2 = (input, options) => Ky.create(input, validateAndMerge(defaults, options));
  for (const method of requestMethods) {
    ky2[method] = (input, options) => Ky.create(input, validateAndMerge(defaults, options, {method}));
  }
  ky2.create = (newDefaults) => createInstance(validateAndMerge(newDefaults));
  ky2.extend = (newDefaults) => {
    if (typeof newDefaults === "function") {
      newDefaults = newDefaults(defaults != null ? defaults : {});
    }
    return createInstance(validateAndMerge(defaults, newDefaults));
  };
  ky2.stop = stop;
  return ky2;
};
const ky = createInstance();
export default ky;
export {HTTPError, TimeoutError};
