import * as vscode from 'vscode'
import * as fs from 'fs';
import * as path from 'path';

interface TreeNode {
    name: string;
    children: TreeNode[];
}

export function buildTree(directory : string) : TreeNode {
    let splitPath = directory.split('/');
    let fileName = splitPath[splitPath.length - 1];
    let root : TreeNode = { name: `<b>${fileName}</b>`, children: [] }

    traverseDirectory(directory, root);

    return root;

}


export function traverseDirectory(directory : string, root : TreeNode) {

	let files = fs.readdirSync(directory);
    //console.log(`Files in directory (${directory}): ${files}\n`);

	for (let file of files) {

		let filePath = path.join(directory, "/", file);

        //console.log(`File path: ${filePath}\n`);

        let node : TreeNode;

        let splitPath = filePath.split('/');
        let fileName = splitPath[splitPath.length - 1];

		if (fs.statSync(filePath).isDirectory()) {
            node = {name: `<b>${fileName}</b>`, children: []}
            root.children.push(node);
			traverseDirectory(filePath, node);
		}
        else {
            node = {name: fileName, children: []}
            root.children.push(node);
        }
	}
}

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
