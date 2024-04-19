import * as vscode from 'vscode'
import * as fs from 'fs';
import * as path from 'path';

interface TreeNode {
    // Filename
    name: string;
    // Children files
    children: TreeNode[];
}

export function buildTree(directory : string) : TreeNode {
    // Get the name of the current directory
    let splitPath = directory.split('/');
    let fileName = splitPath[splitPath.length - 1];
    
    // Create node with bolded text to indicate directory
    let root : TreeNode = { name: `<b>${fileName}</b>`, children: [] }

    // Traverse tree to build the structure
    traverseDirectory(directory, root);

    return root;

}


export function traverseDirectory(directory : string, root : TreeNode) {

	// Using filesystem, get a list of all file entries from "directory"
    let files = fs.readdirSync(directory);

	for (let file of files) {

		// Create new path for children files
        let filePath = path.join(directory, "/", file);

        let node : TreeNode;

        // Retrieve the file name
        let splitPath = filePath.split('/');
        let fileName = splitPath[splitPath.length - 1];

		// Continue recursing if the file type is a directory
        if (fs.statSync(filePath).isDirectory()) {
            // Add new child node to "root" with bolded text to indicate directory when rendered
            node = {name: `<b>${fileName}</b>`, children: []}
            root.children.push(node);
			traverseDirectory(filePath, node);
		}
        // Otherwise, add a new child node to "root" with non-bolded text
        else {
            node = {name: fileName, children: []}
            root.children.push(node);
        }
	}
}

// Render the tree in plain-text using HTML, this is subject to change
export function renderTree(root : TreeNode) {

    let html = `<li>${root.name}</li>`;

    if (root.children) {
        html += "<ul>";
        for (let child of root.children) {
            html += renderTree(child);
        }
        html += "</ul>";
    }

    return `<ul>${html}</ul>`;

}
