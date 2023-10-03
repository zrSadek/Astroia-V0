const fs = require('fs');
const foldersToCount = [
  './source',
  './lang',
  './json.sqlite',
  'version.js',
  'index.js',
  './config',
];

function countLinesInFile(filePath) {
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContents.split('\n').filter((line) => line.trim() !== '').length;
  return lines;
}

function countLinesInFolder(folderPath) {
  const files = fs.readdirSync(folderPath, { withFileTypes: true });

  let totalLines = 0;
  for (const file of files) {
    const filePath = `${folderPath}/${file.name}`;
    if (file.isFile() && filePath.endsWith('.js') || file.isFile() && filePath.endsWith('.json') || file.isFile() && filePath.endsWith('.sqlite')) {
      const lines = countLinesInFile(filePath);
      totalLines += lines;
    } else if (file.isDirectory()) {
      const lines = countLinesInFolder(filePath);
      totalLines += lines;
    }
  }

  return totalLines;
}

function ligne() {
  let totalLines = 0;
  for (const folderPath of foldersToCount) {
    const lines = countLinesInFolder(folderPath);
    totalLines += lines;
    return totalLines
  }

}

module.exports = {
  ligne,
}