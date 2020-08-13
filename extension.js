const vscode = require('vscode');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('terminally-swell.terminallySwell', function () {

		if (!vscode.window.activeTextEditor) return;
		if (!vscode.window.activeTextEditor.document) return;
		if (!vscode.window.activeTextEditor.document.uri) return;
		if (!path.extname(vscode.window.activeTextEditor.document.uri.fsPath.some(ext => ext in [".js", ".ts"]))) return;

		if (vscode.window.terminals.length > 0) {
			let existingTerminal = vscode.window.terminals[0];

			existingTerminal.sendText("cd " + path.dirname(vscode.window.activeTextEditor.document.uri.fsPath));
			existingTerminal.sendText("cls");
			existingTerminal.sendText("node " + path.basename(vscode.window.activeTextEditor.document.uri.fsPath));

			existingTerminal.show(false);
			
			return;
		}

		var terminal = vscode.window.createTerminal({
			cwd: path.dirname(vscode.window.activeTextEditor.document.uri.fsPath)
		});
		
		terminal.sendText("node " + path.basename(vscode.window.activeTextEditor.document.uri.fsPath));
		
		terminal.show(false);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() { }

module.exports = {
	activate,
	deactivate
}