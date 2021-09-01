export default function runBlazorProgram(rootDirectory) {
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
