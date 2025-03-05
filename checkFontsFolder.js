const fs = require('fs');
const path = require('path');

const fontsPath = path.join(__dirname, '../fonts');

fs.access(fontsPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("Fonts folder does not exist:", fontsPath);
  } else {
    console.log("Fonts folder exists:", fontsPath);
  }
}); 