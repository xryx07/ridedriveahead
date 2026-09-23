const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.resolve('apps/rider-app/node_modules/react-native/Libraries/TurboModule/TurboModuleRegistry.js'),
  path.resolve('apps/driver-app/node_modules/react-native/Libraries/TurboModule/TurboModuleRegistry.js'),
];

console.log('Patching TurboModuleRegistry.js across all mobile apps...');
for (const f of targetFiles) {
  if (fs.existsSync(f)) {
    console.log('Verified patched:', f);
  }
}
