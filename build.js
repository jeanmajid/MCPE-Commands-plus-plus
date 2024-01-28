const { exec } = require("child_process");

exec('zip -r commands++.zip . -x "*node_modules*" "*.git*" "package*"', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
