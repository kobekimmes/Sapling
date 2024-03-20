import fs from 'fs';
import path from 'path';

interface TreeNode {

    name: string;
    children: TreeNode[];

}

export function buildTree(directory : string) : TreeNode {
    let root : TreeNode = { name: directory, children: [] }

    traverseDirectory(directory, root);

    return root;

}


export function traverseDirectory(directory : string, root : TreeNode) {

	let files = fs.readdirSync(directory);


	for (let file of files) {

		let filePath = path.join(directory, file);

        let node : TreeNode = {name: filePath, children: []}
        root.children.push(node);

		if (fs.statSync(filePath).isDirectory()) {
			traverseDirectory(filePath, node);
		}
	
	}

}

export function renderTree(root : TreeNode) {
    let html = '<li>${root.name}</li>';

    if (root.children) {
        html += "<ul>";
        for (let child of root.children) {
            html += renderTree(child);
        }
        html += "</ul>";
    }

    return '<ul>${html}</ul>';

}
