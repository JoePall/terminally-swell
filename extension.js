const vscode = require("vscode");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.runInNode", () => {
      if (!vscode.window.activeTextEditor) return;
      if (!vscode.window.activeTextEditor.document) return;
      if (!vscode.window.activeTextEditor.document.uri) return;
      if (!path.extname(vscode.window.activeTextEditor.document.uri.fsPath).endsWith(".js")) return;

      for (let i = 0; i < vscode.window.terminals.length; i++)
        vscode.commands.executeCommand("workbench.action.terminal.kill");

      let terminal = vscode.window.createTerminal({
        cwd: path.dirname(vscode.window.activeTextEditor.document.uri.fsPath),
      });

      terminal.sendText("node " + path.basename(vscode.window.activeTextEditor.document.uri.fsPath))

      terminal.show(false);
    }));

  context.subscriptions.push(
    vscode.commands.registerCommand("terminally-swell.terminalHere", () => {
      if (!vscode.window.activeTextEditor) return;
      if (!vscode.window.activeTextEditor.document) return;
      if (!vscode.window.activeTextEditor.document.uri) return;
      
      for (let i = 0; i < vscode.window.terminals.length; i++)
        vscode.commands.executeCommand("workbench.action.terminal.kill");

      let terminal = vscode.window.createTerminal({
        cwd: path.dirname(vscode.window.activeTextEditor.document.uri.fsPath),
      });

      terminal.show(false);
    }));
}

exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
