require('shelljs/global');
if (exec('jasmine-node '+__dirname+" --forceexit --noColor").code !== 0) {
  exit(1);
}
if (exec('vows '+__dirname+"/*.vows.js --spec").code !== 0) {
  exit(1);
}