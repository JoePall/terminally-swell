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

      newTerminal().sendText(
        "node " +
          path.basename(vscode.window.activeTextEditor.document.uri.fsPath)
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.runInNodeHard", () => {
      if (!hasActiveUri()) return;
      if (!vscode.window.activeTextEditor.document.uri.fsPath.type == ".js") return;

      restartTerminal().sendText(
        "node " +
          path.basename(vscode.window.activeTextEditor.document.uri.fsPath)
      );
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

exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
