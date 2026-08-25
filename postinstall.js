const fs = require('fs');
const p = 'node_modules/lightningcss/node/index.js';
if (fs.existsSync(p)) {
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('} catch (err) {')) {
    content = content.replace('} catch (err) {', '  let req = require;');
    fs.writeFileSync(p, content);
    console.log('Patched lightningcss for Turbopack compatibility.');
  }
}
