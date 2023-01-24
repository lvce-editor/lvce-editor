const p = await import(`data:text/javascript,
  export default import("./foo.js");
`)

export {}
