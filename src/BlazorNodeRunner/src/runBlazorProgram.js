export default function runBlazorProgram(rootDirectory) {
  const { join: joinPath } = require("path");
  const { existsSync: fileExistsSync } = require("fs");
  const blazorJsPath = joinPath(rootDirectory, "_framework", "blazor.webassembly.js");
  require(blazorJsPath);
  globalThis.Blazor = window.Blazor;
  globalThis.DotNet = window.DotNet;
  if (fileExistsSync("app.js")) {
    require("./app.js");
  }
  // Delay Blazor startup to allow any pre-initialization to complete
  setTimeout(() => window.Blazor.start(), 100);

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
