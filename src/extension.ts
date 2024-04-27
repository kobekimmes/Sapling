// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { buildTree, renderTree } from './Tree';
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Declare the panel and initialize
    let panel : vscode.WebviewPanel | undefined = undefined;

	context.subscriptions.push(vscode.commands.registerCommand('Sapling.showTree', () => {
        
        // Check if a current panel is already being displayed
        // and dispose of it if so
        if (panel) {
            console.log("Panel was removed");
            panel.dispose();
        }
        
        // Generate a new panel
        panel = vscode.window.createWebviewPanel(
            // Create a new panel (tab)
            'newPanel',
            // Named 'Sapling - File Tree'
            'Sapling - File Tree',
            vscode.ViewColumn.Active,
            {}
        );

        // Get the current directory of the user's workspace
        const workspaceRoot = getCurrentWorkspaceFolder();

        // If a workspace is opened (and not undefined)
        if (workspaceRoot) {
            // Build tree
            const root = buildTree(workspaceRoot);
            // Generate HTML string of rendering
            const html = renderTree(root);
            // Assign the tabs HTML to the HTML string
            panel.webview.html = html;
        }

        panel.onDidDispose(() => {
            // When the panel is disposed, reset the variable to undefined
            panel = undefined;
        });

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



