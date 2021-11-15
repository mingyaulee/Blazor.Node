import * as program from "./program.js";

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
    await program.main(rootDirectory);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
