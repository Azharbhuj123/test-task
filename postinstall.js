const fs = require('fs');
const p = 'node_modules/lightningcss/node/index.js';
if (fs.existsSync(p)) {
  let content = fs.readFileSync(p, 'utf8');
  // Just replace the require statement inside the catch block to bypass Turbopack's static analysis
  const search = "} catch (err) {\\n  native = require(`../lightningcss.${parts.join('-')}.node`);";
  const replace = "} catch (err) {\\n  let req = require;\\n  native = req(`../lightningcss.${parts.join('-')}.node`);";
  content = content.replace(search, replace);
  fs.writeFileSync(p, content);
  console.log('Patched lightningcss for Turbopack compatibility.');
}
