require('shelljs/global');

var p = require("../package.json");
var newVersion = p.version.split(".");
newVersion[2] = (parseInt(newVersion[2])+1).toString();
newVersion = newVersion.join(".");

cd(__dirname+"/../");
exec("git flow release start "+newVersion);
sed('-i', 'version: '+p.version, 'version: '+newVersion, "package.json");
exec("git commit -am '"+newVersion+" release'");
//exec("git flow release finish "+newVersion);
//exec("npm publish");