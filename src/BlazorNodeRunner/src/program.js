import setDomVariables from "./setDomVariables.js";
import setBlazorVariables from "./setBlazorVariables.js";
import runBlazorProgram from "./runBlazorProgram.js";

export async function main(rootDirectory) {
  await setDomVariables();
  await setBlazorVariables(rootDirectory);
  await runBlazorProgram(rootDirectory);
}
