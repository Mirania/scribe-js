const fs = require("fs");
const path = require("path");
const scout = require("./utils/scout");

if (process.argv.length!=3) {
    console.log("This script requires one and only one file given as an argument.");
    return;
}

let rawfile = fs.readFileSync(process.argv[2], "utf8");
let maintemp = fs.readFileSync(__dirname+"/utils/maintemplate.html", "utf8").split("\n");
let ctxtemp = fs.readFileSync(__dirname+"/utils/ctxtemplate.html", "utf8").split("\n");

let filename = path.basename(process.argv[2]);
let meta = JSON.stringify(scout.scout(rawfile));
let file = JSON.stringify(rawfile.replace(/\r/g,"").replace(/ /g,"&nbsp;").split("\n"));

maintemp[3] = '            var filename = "'+filename+'";\r';
maintemp[4] = '            var meta = '+meta+';\r';
maintemp[5] = '            var file = '+file+';\r';
ctxtemp[3] = '        var filename = "'+filename+'";\r';
ctxtemp[4] = '        var file = '+file+';\r';

fs.writeFileSync('generated/scribe.html',maintemp.join("\n"));
fs.writeFileSync('generated/context.html', ctxtemp.join("\n"));

require('child_process').exec('start "" "'+__dirname+'/generated/scribe.html"');