const { join } = require('path');

// Render only persists the project directory from build into the running
// instance — Puppeteer's default cache dir (the OS home directory) gets
// dropped, leaving no Chrome binary at runtime. Installing into the project
// folder instead makes it survive the build -> deploy step.
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
