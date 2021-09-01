(function () {
  'use strict';

  async function setDomVariables() {
    const { JSDOM } = require("jsdom");
    const jsDom = new JSDOM(`<!DOCTYPE html>
<html>
  <body>
    <div id="app">Loading...</div>
  </body>
</html>`);
    globalThis.window = jsDom.window;
    globalThis.document = jsDom.window.document;
    globalThis.Node = jsDom.window.Node;
    globalThis.Element = jsDom.window.Element;
    globalThis.Comment = jsDom.window.Comment;
    globalThis.HTMLElement = jsDom.window.HTMLElement;
    globalThis.HTMLOptionElement = jsDom.window.HTMLOptionElement;
    globalThis.HTMLSelectElement = jsDom.window.HTMLSelectElement;
    globalThis.navigator = jsDom.window.navigator;
    globalThis.location = jsDom.window.location;

    const nodeFetch = await import('node-fetch');
    globalThis.fetch = nodeFetch;
  }

  async function setBlazorVariables(rootDirectory) {
    const { resolve: resolvePath } = require("path");
    const { readFileSync } = require("fs");
    const { Response, Headers } = await import('node-fetch');

    globalThis.BlazorEnd = globalThis.window.BlazorEnd = function () {
      globalThis.BlazorHasEnded = true;
    };

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

  function runBlazorProgram(rootDirectory) {
    const { join: joinPath } = require("path");
    const blazorJsPath = joinPath(rootDirectory, "_framework", "blazor.webassembly.js");
    require(blazorJsPath);
    globalThis.Blazor = window.Blazor;
    window.Blazor.start();

    return new Promise(resolve => {
      const checkBlazorHasEnded = function () {
        if (globalThis.BlazorHasEnded) {
          resolve();
        } else {
          setTimeout(checkBlazorHasEnded, 500);
        }
      };
      setTimeout(checkBlazorHasEnded, 500);
    });
  }

  async function main(rootDirectory) {
    await setDomVariables();
    await setBlazorVariables(rootDirectory);
    await runBlazorProgram(rootDirectory);
  }

  (async () => {
    let rootDirectory;
    let workingDirectory;
    for (let arg of process.argv) {
      if (!arg.startsWith("--") || !arg.includes(":")) {
        continue;
      }

      const separatorIndex = arg.indexOf(":");
      const argKey = arg.substring(2, separatorIndex);
      const argValue = arg.substring(separatorIndex + 1);

      if (argKey === "rootDirectory") {
        rootDirectory = argValue;
      } else if (argKey === "workingDirectory") {
        workingDirectory = argValue;
      }
    }

    if (!rootDirectory) {
      throw new Error("Root directory is not defined.");
    }

    if (!workingDirectory) {
      throw new Error("Working directory is not defined.");
    }

    const { execSync: execChildProcessSync } = require("child_process");
    execChildProcessSync('npm install --prefer-offline --no-audit', {
      stdio: [0, 1, 2],
      cwd: workingDirectory
    });

    try {
      await main(rootDirectory);
    } catch (error) {
      console.error(error);
    }
  })();

}());
