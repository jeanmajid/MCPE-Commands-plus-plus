const fs = require("fs");
const archiver = require("archiver");

const output = fs.createWriteStream(__dirname + "/your-pack-name.mcpack");
const archive = archiver("zip", {
    zlib: { level: 9 },
});

archive.pipe(output); //ss

archive.glob("**", {
    ignore: ["node_modules/**", ".git/**", ".github/**", "*.mcpack", "package-lock.json", "package.json"],
});

archive.finalize();
