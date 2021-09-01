export default async function setDomVariables() {
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

  const nodeFetch = await import("node-fetch");
  globalThis.fetch = nodeFetch;
}

