const folderStructure = {
  name: "Root",
  type: "folder",
  children: [
    {
      name: "Folder 1",
      type: "folder",
      children: [
        { name: "File 1.txt", type: "file" },
        { name: "File 2.txt", type: "file" },
      ],
    },
    {
      name: "Folder 2",
      type: "folder",
      children: [{ name: "File 3.txt", type: "file" }],
    },
  ],
};

function createTreeElement(item) {
  const element = document.createElement("div");

  // Create icon for the item
  const icon = document.createElement("i");
  if (item.type === "folder") {
    icon.className = "fas fa-folder";
  } else {
    icon.className = "fas fa-file";
  }
  element.appendChild(icon);

  // Create text content for the item
  const text = document.createElement("span");
  text.textContent = item.name;
  element.appendChild(text);

  // Create delete button for the item
  if (item.type !== "root") {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      deleteItem(item);
    };
    element.appendChild(deleteButton);
  }

  // Add CSS class
  element.classList.add("tree-element");
  element.classList.add(item.type);

  // Add children recursively
  if (item.type === "folder" && item.children) {
    item.children.forEach((child) => {
      const childElement = createTreeElement(child);
      element.appendChild(childElement);
    });
  }

  return element;
}

function deleteItem(item) {
  const parent = findParent(folderStructure, item);
  if (parent) {
    parent.children = parent.children.filter((child) => child !== item);
    updateFolderTree();
  }
}

function findParent(root, target) {
  if (root.children && root.children.includes(target)) {
    return root;
  } else if (root.children) {
    for (const child of root.children) {
      const parent = findParent(child, target);
      if (parent) {
        return parent;
      }
    }
  }
  return null;
}

function addFile() {
  const fileNameInput = document.getElementById("fileNameInput");
  const fileName = fileNameInput.value.trim();
  if (fileName !== "") {
    addFileToFolder(folderStructure, fileName);
    fileNameInput.value = ""; // Clear input field
  }
}

function addFolder() {
  const folderNameInput = document.getElementById("folderNameInput");
  const folderName = folderNameInput.value.trim();
  if (folderName !== "") {
    addFolderToFolder(folderStructure, folderName);
    folderNameInput.value = ""; // Clear input field
  }
}

function addFileToFolder(parentFolder, fileName) {
  // Create a file object
  const file = { name: fileName, type: "file" };

  // Add the file to the parent folder
  parentFolder.children.push(file);

  // Update the folder tree display
  updateFolderTree();
}

function addFolderToFolder(parentFolder, folderName) {
  // Create a folder object
  const folder = { name: folderName, type: "folder", children: [] };

  // Add the folder to the parent folder
  parentFolder.children.push(folder);

  // Update the folder tree display
  updateFolderTree();
}

function updateFolderTree() {
  // Clear the existing folder tree
  folderTree.innerHTML = "";

  // Recreate the folder tree from the folder structure
  const treeElement = createTreeElement(folderStructure);
  folderTree.appendChild(treeElement);
}
function deleteItem(item) {
  const parent = findParent(folderStructure, item);
  if (parent) {
    parent.children = parent.children.filter((child) => child !== item);
    updateFolderTree();
    window.alert("Item deleted successfully."); // แสดงข้อความแจ้งเตือนเมื่อลบไฟล์หรือโฟลเดอร์สำเร็จ
  }
}

const folderTree = document.getElementById("folderTree");
const treeElement = createTreeElement(folderStructure);
folderTree.appendChild(treeElement);
