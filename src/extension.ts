// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { buildTree, renderTree } from './Tree';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('Sapling.showTree', () => {
        const panel = vscode.window.createWebviewPanel(
            'newPanel',
            'File tree',
            vscode.ViewColumn.One,
            {}
        );

		
        const workspaceRoot = getCurrentWorkspaceFolder();
        //const workspaceRoot = "/Users/kobekimmes/Projects/Extensions/VS-Code/Sapling";
        //const workspaceRoot = "/Users/kobekimmes/CognalysisProgrammingExercise";
        //console.log(`Current directory: ${workspaceRoot}`);

        if (workspaceRoot) {
            console.log("Building tree");
            const root = buildTree(workspaceRoot);
            const html = renderTree(root);
            panel.webview.html = html;
        }
    }));
}

// This method is called when your extension is deactivated
export function deactivate() {

}


function getCurrentWorkspaceFolder() : string | undefined {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        // Get the URI of the currently active file
        const fileUri = activeEditor.document.uri;
        // Check if the file is inside a workspace folder
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
        if (workspaceFolder) {
            // Return the name of the workspace folder
            return workspaceFolder.uri.fsPath;
        }
    }
    // Return undefined if no workspace folder is found
    return undefined;
}



