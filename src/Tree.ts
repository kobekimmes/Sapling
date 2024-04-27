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
    let root : TreeNode = { name: `<b>&#128193; ${fileName}</b>`, children: [] }

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
            
            node = {name: `&#128193; <b>${fileName}</b>`, children: []}
            root.children.push(node);
			traverseDirectory(filePath, node);
		}
        // Otherwise, add a new child node to "root" with non-bolded text
        else {
            let periodIdx = fileName.indexOf('.');
            let fileType = fileName.substring(periodIdx+1);
            let fileEmoji;
            
            switch (fileType) {

                case "py":
                    fileEmoji = "&#128013;";
                    break;
                // case "pdf":
                //     fileEmoji = "&#x1F4D6;";
                //     break;
                // case "cc":
                // case "cpp":
                //     fileEmoji = "&#127912;"
                //     break;
                // case "java":
                //     fileEmoji = "&#128230;"
                //     break;
                
                // Handles .txt files and any others without a specified emoji encoding
                default: 
                    fileEmoji = "&#128196"
                    break;
            }
            node = {name: `${fileEmoji} ${fileName}`, children: []}
            root.children.push(node);
        }
	}
}

// Render the tree in plain-text using HTML, this is subject to change
export function renderTree(root : TreeNode) {

    let html = `<li >${root.name}</li>`;

    if (root.children) {
        html += "<ul style=list-style-type: none;>";
        for (let child of root.children) {
            html += renderTree(child);
        }
        html += "</ul>";
    }

    return `<ul>${html}</ul>`;

}
