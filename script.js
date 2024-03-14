 // โครงสร้างโฟลเดอร์เริ่มต้น\
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

// ฟังก์ชันสร้าง element ของต้นไม้โฟลเดอร์
function createTreeElement(item) {
  const element = document.createElement("div");

  // สร้างไอคอนสำหรับไอเท็ม
  const icon = document.createElement("i");
  if (item.type === "folder") {
    icon.className = "fas fa-folder";
    // เพิ่มเหตุการณ์คลิกสำหรับโฟลเดอร์เพื่อสลับการขยาย/ยุบ
    icon.addEventListener("click", function () {
      toggleFolder(item);
    });
  } else {
    icon.className = "fas fa-file";
  }
  element.appendChild(icon);

  // สร้างเนื้อหาข้อความสำหรับไอเท็ม
  const text = document.createElement("span");
  text.textContent = item.name;
  // เพิ่มเหตุการณ์คลิกเพื่อเลือกโฟลเดอร์
  text.addEventListener("click", function () {
    selectFolder(element);
  });
  element.appendChild(text);

  // สร้างปุ่มลบสำหรับไอเท็ม (หากเป็นไฟล์)
  if (item.type === "file") {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "ลบไฟล์";
    deleteButton.onclick = function () {
      deleteItem(item);
    };
    element.appendChild(deleteButton);
  }

  // สร้างปุ่มลบสำหรับไอเท็ม (หากเป็นโฟลเดอร์)
  if (item.type === "folder") {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "ลบโฟลเดอร์";
    deleteButton.onclick = function () {
      deleteItem(item);
    };
    element.appendChild(deleteButton);
    element.addEventListener("dragover", allowDrop);
    element.addEventListener("drop", function (event) {
      dropFile(event, item);
    });
  } else {
    element.draggable = true;
    element.addEventListener("dragstart", function (event) {
      drag(event, item);
    });
  }

  // เพิ่มคลาส CSS
  element.classList.add("tree-element");
  element.classList.add(item.type);
  if (item.type === "folder") {
    element.classList.add("folder"); // เพิ่มคลาส 'folder' สำหรับโฟลเดอร์
  }

  // เพิ่มลูกโดยทำซ้ำ (หากเป็นโฟลเดอร์และมีลูก)
  if (item.type === "folder" && item.children) {
    item.children.forEach((child) => {
      const childElement = createTreeElement(child);
      element.appendChild(childElement);
    });
  }

  return element;
}

// ฟังก์ชันสำหรับการสลับการขยาย/ยุบโฟลเดอร์
function toggleFolder(folder) {
  folder.isExpanded = !folder.isExpanded;
  updateFolderTree();
}

// ฟังก์ชันสำหรับการลบไอเท็ม
function deleteItem(item) {
  const parent = findParent(folderStructure, item);
  if (parent) {
    parent.children = parent.children.filter((child) => child !== item);
    updateFolderTree();
    window.alert("ลบไอเท็มสำเร็จแล้ว");
  }
}

// ฟังก์ชันสำหรับค้นหาโฟลเดอร์แม่ของไอเท็ม
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

// ฟังก์ชันสำหรับเพิ่มไฟล์
function addFile() {
  const fileNameInput = document.getElementById("fileNameInput");
  const fileName = fileNameInput.value.trim();
  if (fileName !== "") {
    promptFolderSelection(function (selectedFolder) {
      if (selectedFolder) {
        addFileToFolder(selectedFolder, fileName);
        fileNameInput.value = "";
      } else {
        alert("ไม่พบโฟลเดอร์");
      }
    });
  }
}

// ฟังก์ชันสำหรับเพิ่มโฟลเดอร์
function addFolder() {
  const folderNameInput = document.getElementById("folderNameInput");
  const folderName = folderNameInput.value.trim();
  if (folderName !== "") {
    addFolderToFolder(folderStructure, folderName);
    folderNameInput.value = "";
  }
}

// ฟังก์ชันสำหรับเพิ่มไฟล์ลงในโฟลเดอร์
function addFileToFolder(parentFolder, fileName) {
  const file = { name: fileName, type: "file" };
  parentFolder.children.push(file);
  updateFolderTree();
}

// ฟังก์ชันสำหรับเพิ่มโฟลเดอร์ลงในโฟลเดอร์
function addFolderToFolder(parentFolder, folderName) {
  const folder = { name: folderName, type: "folder", children: [] };
  parentFolder.children.push(folder);
  updateFolderTree();
}

// ฟังก์ชันสำหรับการอัปเดตต้นไม้โฟลเดอร์
function updateFolderTree() {
  folderTree.innerHTML = "";
  const treeElement = createTreeElement(folderStructure);
  folderTree.appendChild(treeElement);
}

// ฟังก์ชันสำหรับแสดงหน้าต่างโปรมป์ให้เลือกโฟลเดอร์
function promptFolderSelection(callback) {
  const folderName = prompt(
    "ป้อนชื่อโฟลเดอร์ที่ต้องการเพิ่มไฟล์:"
  );
  if (folderName !== null) {
    const selectedFolder = findFolderByName(folderStructure, folderName);
    callback(selectedFolder);
  }
}

// ฟังก์ชันสำหรับค้นหาโฟลเดอร์โดยชื่อ
function findFolderByName(parentFolder, folderName) {
  if (
    parentFolder.name === folderName &&
    parentFolder.type === "folder"
  ) {
    return parentFolder;
  } else if (parentFolder.children) {
    for (const child of parentFolder.children) {
      const foundFolder = findFolderByName(child, folderName);
      if (foundFolder) {
        return foundFolder;
      }
    }
  }
  return null;
}

// ฟังก์ชันสำหรับเลือกโฟลเดอร์
function selectFolder(folderElement) {
  const selectedElements = document.querySelectorAll(".selected");
  selectedElements.forEach((element) => {
    element.classList.remove("selected");
  });
  folderElement.classList.add("selected");
}

// ฟังก์ชันสำหรับอนุญาตให้ใช้ลากไฟล์
function allowDrop(event) {
  event.preventDefault();
}

// ฟังก์ชันสำหรับลากไฟล์
function drag(event, item) {
  event.dataTransfer.setData("text", item.name);
}

// ฟังก์ชันสำหรับวางไฟล์ลงในโฟลเดอร์
function dropFile(event, targetFolder) {
  event.preventDefault();
  const fileName = event.dataTransfer.getData("text");
  const file = { name: fileName, type: "file" };
  targetFolder.children.push(file);
  const parentFolder = findParent(folderStructure, fileName);
  if (parentFolder) {
    parentFolder.children = parentFolder.children.filter(
      (child) => child.name !== fileName
    );
    updateFolderTree();
  }
}

// ดึงต้นไม้โฟลเดอร์และแสดงในหน้าเว็บ
const folderTree = document.getElementById("folderTree");
const treeElement = createTreeElement(folderStructure);
folderTree.appendChild(treeElement);

// ฟังก์ชันสำหรับวางไฟล์
function dropFile(event, targetFolder) {
  event.preventDefault();
  const fileName = event.dataTransfer.getData("text");
  const file = { name: fileName, type: "file" };

  // ค้นหาโฟลเดอร์เป้าหมายตามชื่อ
  const parentFolder = findParent(folderStructure, fileName);

  if (parentFolder) {
    // ลบไฟล์ออกจากโฟลเดอร์เดิม
    parentFolder.children = parentFolder.children.filter(
      (child) => child.name !== fileName
    );

    // เพิ่มไฟล์เข้าในโฟลเดอร์เป้าหมาย
    targetFolder.children.push(file);

    // อัปเดตต้นไม้โฟลเดอร์
    updateFolderTree();
  } else {
    // หากไม่พบไฟล์ในโฟลเดอร์ใด อาจเป็นไฟล์ที่ลากมาจากภายนอก
    // ในกรณีนี้เราจะเพิ่มไฟล์โดยตรงลงในโฟลเดอร์เป้าหมาย
    targetFolder.children.push(file);
    updateFolderTree();
  }
}