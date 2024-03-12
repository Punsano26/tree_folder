class TreeNode {
    constructor(name) {
        this.name = name;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }
}

const root = new TreeNode("Root Folder");
const folderA = new TreeNode("Folder A");
const folderB = new TreeNode("Folder B");
const folderC = new TreeNode("Folder C");

root.addChild(folderA);
root.addChild(folderB);
folderA.addChild(folderC);
