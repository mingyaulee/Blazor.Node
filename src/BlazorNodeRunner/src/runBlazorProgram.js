export default function runBlazorProgram(rootDirectory) {
  const { join: joinPath } = require("path");
  const { existsSync: fileExistsSync } = require("fs");
  const blazorJsPath = joinPath(rootDirectory, "_framework", "blazor.webassembly.js");
  require(blazorJsPath);
  globalThis.Blazor = window.Blazor;
  if (fileExistsSync("app.js")) {
    require("./app.js");
  }
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
