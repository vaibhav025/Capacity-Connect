const ts = require('typescript');
const fs = require('fs');
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd());
const host = { getScriptFileNames: () => parsed.fileNames, getScriptVersion: () => '0', getScriptSnapshot: name => fs.existsSync(name) ? ts.ScriptSnapshot.fromString(fs.readFileSync(name, 'utf8')) : undefined, getCurrentDirectory: () => process.cwd(), getCompilationSettings: () => parsed.options, getDefaultLibFileName: options => ts.getDefaultLibFilePath(options), fileExists: ts.sys.fileExists, readFile: ts.sys.readFile, readDirectory: ts.sys.readDirectory };
const service = ts.createLanguageService(host);
for (const fileName of parsed.fileNames) {
  for (const edit of service.organizeImports({ type: 'file', fileName }, {}, {})) {
    let content = fs.readFileSync(edit.fileName, 'utf8');
    for (const change of [...edit.textChanges].sort((a, b) => b.span.start - a.span.start)) content = content.slice(0, change.span.start) + change.newText + content.slice(change.span.start + change.span.length);
    fs.writeFileSync(edit.fileName, content);
  }
}
