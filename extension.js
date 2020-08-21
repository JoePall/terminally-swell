const vscode = require("vscode");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.runInNode", () => {
      if (!hasActiveUri()) return;
      if (!vscode.window.activeTextEditor.document.uri.fsPath.type == ".js") return;

      var terminal = newTerminal();
      delay(200);
      terminal.sendText(
        "node " +
        path.basename(vscode.window.activeTextEditor.document.uri.fsPath)
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.runInNodeHard", () => {
      if (!hasActiveUri()) return;
      if (!vscode.window.activeTextEditor.document.uri.fsPath.type == ".js") return;

      var terminal = restartTerminal();
      delay(200);
      terminal.sendText(
        "node " +
        path.basename(vscode.window.activeTextEditor.document.uri.fsPath)
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.npmTest", () => {
      if (!hasActiveUri()) return;

      var terminal = newTerminal();
      delay(200);
      terminal.sendText("npm run test");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.npmTestHard", () => {
      if (!hasActiveUri()) return;

      var terminal = restartTerminal();
      delay(200);
      terminal.sendText("npm run test");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.herokuPush", () => {
      if (!hasActiveUri()) return;

      var terminal = newTerminal();
      delay(200);
      terminal.sendText("git push heroku master");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.herokuPushHard", () => {
      if (!hasActiveUri()) return;

      var terminal = restartTerminal();
      delay(200);
      terminal.sendText("git push heroku master");    
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.terminalHere", () => {
      if (hasActiveUri()) newTerminal();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.terminalHereHard", () => {
      if (hasActiveUri()) restartTerminal();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.discardAllTerminals", () => {
      restartTerminal();
    })
  );
}

function newTerminal() {
  return vscode.window.createTerminal({
    cwd: path.dirname(vscode.window.activeTextEditor.document.uri.fsPath),
    show: false
  });
}

function closeTerminals() {
  for (let i = 0; i < vscode.window.terminals.length; i++)
    vscode.commands.executeCommand("workbench.action.terminal.kill");
}

function restartTerminal() {
  closeTerminals();
  return newTerminal();
}

function hasActiveUri() {
  var result = true;

  result = result && vscode.window.activeTextEditor;
  result = result && vscode.window.activeTextEditor.document;
  result = result && vscode.window.activeTextEditor.document.uri;

  return result;
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
