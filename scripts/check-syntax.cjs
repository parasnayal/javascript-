const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
let checked = 0;

for (const directory of fs.readdirSync(root, { withFileTypes: true })) {
  if (!directory.isDirectory() || !/^0[1-6]-/.test(directory.name)) continue;

  for (const file of fs.readdirSync(path.join(root, directory.name))) {
    if (!file.endsWith(".js")) continue;
    const filename = path.join(directory.name, file);
    try {
      // Parse classic scripts without executing browser APIs or intentional errors.
      new vm.Script(fs.readFileSync(path.join(root, filename), "utf8"), {
        filename,
      });
      checked += 1;
    } catch (error) {
      console.error(`${filename}: ${error.message}`);
      process.exitCode = 1;
    }
  }
}

console.log(`Syntax checked ${checked} JavaScript topic files.`);
