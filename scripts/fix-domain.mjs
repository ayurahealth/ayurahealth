import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('ayura.ai')) {
      content = content.replace(/ayura\.ai/g, 'ayurahealth.com');
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  } catch {
    // skip
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'out'].includes(file)) {
        traverseDir(fullPath);
      }
    } else {
       if (fullPath.match(/\.(ts|tsx|js|jsx|json|xml|svg|md|css|html|txt|plist)$/)) {
        replaceInFile(fullPath);
       }
    }
  }
}

traverseDir('.');
