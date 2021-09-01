export default async function setBlazorVariables(rootDirectory) {
  const { resolve: resolvePath } = require("path");
  const { readFileSync } = require("fs");
  const { Response, Headers } = await import("node-fetch");

  globalThis.BlazorEnd = globalThis.window.BlazorEnd = function () {
    globalThis.BlazorHasEnded = true;
  }

  globalThis.Module = globalThis.window.Module = {};

  // override document.body.appendChild
  const appendChild = globalThis.document.body.appendChild;
  const handleScriptElement = function (element) {
    const scriptElement = /** @type {HTMLScriptElement} */(element);
    if (scriptElement.innerHTML?.indexOf("__wasmmodulecallback__") > -1) {
      globalThis.window.__wasmmodulecallback__();
      delete globalThis.window.__wasmmodulecallback__;
    } else if (scriptElement.src) {
      const filePath = resolvePath(rootDirectory, scriptElement.src);
      require(filePath);
    } else {
      console.error("Unknown script requested", element);
      throw new Error("Unknown script requested");
    }
  };
  globalThis.document.body.appendChild = function (element) {
    if (element.tagName === "SCRIPT") {
      handleScriptElement(element);
    } else {
      appendChild(element);
    }
  };

  // override fetch
  const fetch = globalThis.fetch;
  const getFrameworkResource = function (url, resolve) {
    const filePath = resolvePath(rootDirectory, url);
    const file = readFileSync(filePath);
    let contentType = "application/octet-stream";
    if (url.endsWith(".json")) {
      contentType = "application/json";
    } else if (url.endsWith(".wasm")) {
      contentType = "application/wasm";
    }
    const response = new Response(file, {
      headers: new Headers({
        "content-type": contentType
      }),
      status: 200
    });
    resolve(response);
  };
  globalThis.fetch = function (url, init) {
    if (url && url.startsWith("_framework")) {
      return new Promise(resolve => getFrameworkResource(url, resolve));
    }
    return fetch(url, init);
  };
}
