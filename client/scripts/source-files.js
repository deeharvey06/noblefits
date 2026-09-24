const fs = require("fs");
const path = require("path");

// Feature checks follow colocated components/hooks without depending on one large file.
const readFeature = (relativeDirectory) => {
  const directory = path.resolve(__dirname, "..", relativeDirectory);
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        /\.[jt]sx?$/.test(entry.name) &&
        !entry.name.includes(".test."),
    )
    .map((entry) => fs.readFileSync(path.join(directory, entry.name), "utf8"))
    .join("\n");
};

module.exports = { readFeature };
