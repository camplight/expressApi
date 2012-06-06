require('shelljs/global');

var p = require("../package.json");
var newVersion = p.version.split(".");
newVersion[2] = (parseInt(newVersion[2])+1).toString();
newVersion = newVersion.join(".");

cd(__dirname+"/../");
if(exec("git flow release start "+newVersion).code != 0) return;
if(sed('-i', 'version: '+p.version, 'version: '+newVersion, "package.json").code != 0) return;
if(exec("git commit -am '"+newVersion+" release'").code != 0) return;
if(exec("git flow release finish").code != 0) return;
if(exec("npm publish").code != 0) return;