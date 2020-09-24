const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  addCommand("terminally-swell.node", () => {
    launchTerminal("node " + vscode.window.activeTextEditor.document.uri.fsPath.split("\\").pop(), false, true, true);
  });
  addCommand("terminally-swell.nodeHard", () => {
    launchTerminal("node " + vscode.window.activeTextEditor.document.uri.fsPath.split("\\").pop(), true, true, true);
  });
  addCommand("terminally-swell.npmInstall", () => launchTerminal("npm i", false, false, false, true));
  addCommand("terminally-swell.npmInstallHard", () => launchTerminal("npm i", true, false, false, true));
  addCommand("terminally-swell.npmStart", () => launchTerminal("npm start", false, false, false, true));
  addCommand("terminally-swell.npmStartHard", () => launchTerminal("npm start", true, false, false, true));
  addCommand("terminally-swell.npmTest", () => launchTerminal("npm test", false, false, false, true));
  addCommand("terminally-swell.npmTestHard", () => launchTerminal("npm test", true, false, false, true));
  addCommand("terminally-swell.herokuPush", () => launchTerminal("git push heroku master"));
  addCommand("terminally-swell.herokuPushHard", () => launchTerminal("git push heroku master", true));
  addCommand("terminally-swell.openCurrent", () => launchTerminal(null, false, false, false, false, true));
  addCommand("terminally-swell.openCurrentHard", () => launchTerminal(null, true, false, false, false, true));
  addCommand("terminally-swell.discardAllTerminals", () => discardAllTerminals());

  function addCommand(name, command) {
    context.subscriptions.push(vscode.commands.registerCommand(name, command));
  }
}

function launchTerminal(command, needsRestart = false, needsUri = false, needsJs = false, needsPackages = false, openNearest = false) {
  if (needsUri && !hasActiveUri()) return;
  let type = vscode.window.activeTextEditor.document.uri.fsPath.split(".").pop();

  if (needsJs && type !== "js") {
    vscode.window.showInformationMessage("Active file needs to be of type .js");
    return;
  }
  let cwd = vscode.workspace.workspaceFolders[0].uri.fsPath;
  let cfd = path.dirname(vscode.window.activeTextEditor.document.uri.fsPath);
  if (needsPackages) cwd = getNearestPackagePath(cfd, cwd);
  else if (openNearest) cwd = cfd;

  let terminal = (needsRestart) ? restartTerminal(cwd) : newTerminal(cwd);

  delay(200); 
  terminal.sendText(command);
  terminal.show("false");
}

function getNearestPackagePath(cfd, cwd) {
  let files = fs.readdirSync(cfd);
  if (files.some(item => item === "package.json")) return cfd;
  else if (cwd.length > cfd.length) return cwd;

  let result = [];
  cfd.split("\\").forEach(part => result.push(part));
  result.pop();
  cfd = result.join("\\");

  return getNearestPackagePath(cfd, cwd);
}

function newTerminal(path) {
  return vscode.window.createTerminal({
    cwd: path,
    show: true
  });
}

function restartTerminal(path) {
  discardAllTerminals();
  return newTerminal(path);
}

function discardAllTerminals() {
  for (let i = 0; i < vscode.window.terminals.length; i++)
    vscode.commands.executeCommand("workbench.action.terminal.kill");
}

function hasActiveUri() {
  return vscode.window.activeTextEditor.document;
}

function delay(milliseconds) {
  setTimeout(() => {
    return;
  }, milliseconds);
}

exports.activate = activate;

function deactivate() {

}

module.exports = {
  activate,
  deactivate,
};
