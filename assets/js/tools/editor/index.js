let selectedNode = null;
const userRegex = /({{\s*([^|}]*?)\s*(?:\|\s*([^}]*?)\s*)?}})/g;

// Store uploaded images as { id, src, name }
let uploadedImages = [];
let uploadedImageId = 0;

const { stage, layer, transformer } = init();

// Menu navigation
const menuItems = document.querySelectorAll(".menu-item");
const detailPanels = document.querySelectorAll(".detail-panel");
const sidebarLeftExtension = document.querySelector("#sidebarLeftExtension");

function showMenuSidebar(panelId) {
  sidebarLeftExtension.style.display = "block";

  // Hide all panels
  detailPanels.forEach((panel) => panel.classList.remove("active"));

  // Show corresponding panel
  document.getElementById(panelId).classList.add("active");
}

function hideMenuSidebar() {
  sidebarLeftExtension.style.display = "none";

  // Hide all panels
  detailPanels.forEach((panel) => panel.classList.remove("active"));
}

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove active class from all menu items
    menuItems.forEach((mi) => mi.classList.remove("active"));
    // Add active class to clicked item
    item.classList.add("active");

    showMenuSidebar(item.getAttribute("data-panel") + "-panel");
  });
});

document.getElementById("imageUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      // Add to uploadedImages array
      uploadedImages.push({
        id: uploadedImageId++,
        src: event.target.result,
        name: file.name,
      });
      renderUploadedImagesGrid();
    };
    reader.readAsDataURL(file);
  }
});

// Render uploaded images grid
function renderUploadedImagesGrid() {
  const grid = document.getElementById("uploadedImagesGrid");
  grid.innerHTML = "";
  uploadedImages.forEach((imgObj) => {
    const item = document.createElement("li");
    item.className = "uploaded-image-item";
    item.innerHTML = `
      <img src="${imgObj.src}" alt="${imgObj.name}" />
      <div class="uploaded-image-actions">
        <button class="add-btn" title="Add to Canvas">Add</button>
        <button class="delete-btn" title="Delete">Remove</button>
      </div>
    `;
    // Add button
    item.querySelector(".add-btn").onclick = () => {
      addImageToCanvas(imgObj);
    };
    // Delete button
    item.querySelector(".delete-btn").onclick = () => {
      uploadedImages = uploadedImages.filter((img) => img.id !== imgObj.id);
      renderUploadedImagesGrid();
    };
    grid.appendChild(item);
  });
}

// Add image to canvas
function addImageToCanvas({ src, name }) {
  const img = new window.Image();
  img.onload = () => {
    const kImg = addImage(layer, img, name);
    kImg.on("click", () => {
      selectNode(kImg);
    });
  };
  img.src = src;
}

// Add text to canvas
document.getElementById("addTextBtn").addEventListener("click", () => {
  const kText = addText(layer, "Add Text", "Arial", 100);
  kText.on("click", () => {
    selectNode(kText);
  });
});

// Select node
function selectNode(node) {
  selectedNode = node;
  transformer.nodes([node]);
  transformer.moveToTop();

  if (node.getClassName() === "Image") {
    setImageMetadata(getImageMetadata(selectedNode));
    // const { type, filters } = getFilters(selectedNode);
    // setFilterUIVals(type, filters);
    // const { rotation } = getTransformation(selectedNode);
    // setUIValRotation(rotation);
    // div_adjustFilters.style.display = "block";
    // div_adjustAdjust.style.display = "block";
    // div_metaImage.style.display = "block";
    // div_metaText.style.display = "none";
    sidebar.setAttribute("data-view", "image");
  } else if (node.getClassName() === "Text") {
    setUIValFontFamily(node.fontFamily());
    setUIValFontSize(node.fontSize());
    setUIValAdjustText(convertToVariableSyntax(node.text()));
    setUIValColor(node.fill() || "#ffffff");
    // div_adjustFilters.style.display = "none";
    // div_metaImage.style.display = "none";
    // div_adjustAdjust.style.display = "block";
    // div_metaText.style.display = "block";
    sidebar.setAttribute("data-view", "text");
  }

  showMenuSidebar("adjust-image-panel");
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });

  layer.draw();
}

// Deselect on background click
stage.on("click", (e) => {
  if (e.target === stage) {
    transformer.detach(); // same as transformer.nodes([]);
    selectedNode = null;
    // document.getElementById("updateTextBtn").style.display = "none";
    // document.getElementById("addTextBtn").style.display = "block";
    // document.getElementById("textInput").value = "";
    // hideMenuSidebar();
    layer.draw();
  }
});

// Meta data
function setImageMetadata({ name }) {
  input_imageName.value = name.value || name.default;
  if (name.default) {
    // image name is variable
    text_imageNameDefault.textContent = name.default || "";
    input_imageName.disabled = false;
  } else {
    input_imageName.disabled = true;
  }
}

function getImageMetadata(node) {
  if (!node || node.getClassName() != "Image") {
    return;
  }
  const data = {};
  data.name = {
    default: node.getAttr("defaults")?.path || "",
    value: node.getAttr("path") || "",
  };

  return data;
}

function convertImageToVariable() {
  if (!selectedNode || selectedNode.getClassName() != "Image") {
    return;
  }

  input_imageName.disabled = false;
  input_imageName.value = "";
  input_imageName.placeholder = "Enter variable id";
}

input_imageName.addEventListener("input", (e) => {
  let imageName = e.target.value.trim();

  // if (!imageName.match(/\{\{.*\}\}/g)) {
  //   return; // continue only if variable format is correct
  // }

  // if (!imageName.match(variableRegex)) {
  //   // is a variable, but does not start with `.`
  //   imageName = imageName.replace(/\{\{\s*(\w*?)\s*\}\}/g, "{{ .$1 }}");
  //   e.target.value = imageName;
  // }

  embedVariablesToImage(selectedNode, {
    path: convertToTemplateSyntax(imageName),
  });
});

input_textColor.addEventListener("change", (e) => {
  if (!selectedNode || !selectedNode.getClassName() === "Text") {
    return;
  }

  selectedNode.fill(e.target.value);
});

// Quick Filters
const filterButtons = document.querySelectorAll(".filter-btn");
let currentFilter = "none";

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (selectedNode && selectedNode.getClassName() === "Image") {
      // Remove active class from all filter buttons
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterType = btn.getAttribute("data-filter");
      currentFilter = filterType;
      setUIValBrightness(0);
      setUIValContrast(0);
      applyQuickFilter(selectedNode, filterType);
    }
  });
});

document.getElementById("brightness").addEventListener("input", (e) => {
  document.getElementById("brightnessVal").textContent = e.target.value;
});

document.getElementById("brightness").addEventListener("change", (e) => {
  applyFiltersToSelected(selectedNode, { brightness: e.target.value });
});

document.getElementById("contrast").addEventListener("input", (e) => {
  document.getElementById("contrastVal").textContent = e.target.value;
});

document.getElementById("contrast").addEventListener("change", (e) => {
  applyFiltersToSelected(selectedNode, { contrast: e.target.value });
});

document.getElementById("blur").addEventListener("input", (e) => {
  document.getElementById("blurVal").textContent = e.target.value;
});

document.getElementById("blur").addEventListener("change", (e) => {
  applyFiltersToSelected(selectedNode, { blur: e.target.value });
});

// setFilterUIVals sets UI element values
// for filter section to provided values
function setFilterUIVals(
  quickFilterType = "none",
  filters = { brightness: 0, contrast: 0, blur: 0 },
) {
  if (selectedNode.getClassName() != "Image") return;

  filterButtons.forEach((btn) => {
    if (btn.getAttribute("data-filter") === quickFilterType) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  if (quickFilterType === "none") {
    setUIValBrightness(filters.brightness);
    setUIValContrast(filters.contrast);
  } else {
    setUIValBrightness(0);
    setUIValContrast(0);
  }
  setUIValBlur(filters.blur);

  let radiusPx = selectedNode.cornerRadius ? selectedNode.cornerRadius() : 0;
  let minDim = Math.min(selectedNode.width(), selectedNode.height());
  let radiusPercent = minDim ? Math.round((radiusPx / minDim) * 100) : 0;
  setUIValBorderRadius(radiusPercent);
}

function setUIValBrightness(val) {
  document.getElementById("brightnessVal").textContent = val;
  document.getElementById("brightness").value = val;
}
function setUIValContrast(val) {
  document.getElementById("contrastVal").textContent = val;
  document.getElementById("contrast").value = val;
}
function setUIValBlur(val) {
  document.getElementById("blurVal").textContent = val;
  document.getElementById("blur").value = val;
}

// TODO: Konva has internal rotation mechanics
// Rotate
// document.getElementById("rotation").addEventListener("input", (e) => {
//   document.getElementById("rotationVal").textContent = e.target.value;
// });
// document.getElementById("rotation").addEventListener("change", (e) => {
//   rotate(selectedNode, e.target.value);
// });
// function setUIValRotation(val) {
//   document.getElementById("rotationVal").textContent = val;
//   document.getElementById("rotation").value = val;
// }

// Border Radius
document.getElementById("borderRadius").addEventListener("input", (e) => {
  document.getElementById("borderRadiusVal").textContent = e.target.value + "%";
});

document.getElementById("borderRadius").addEventListener("change", (e) => {
  applyBorderRadiusToSelected(selectedNode, parseInt(e.target.value, 10));
});

function setUIValBorderRadius(val) {
  document.getElementById("borderRadiusVal").textContent = val + "%";
  document.getElementById("borderRadius").value = val;
}

// Adjustments
document.getElementById("input_adjustText").addEventListener("change", (e) => {
  const text = document.getElementById("input_adjustText").value;
  const fontSize = parseInt(document.getElementById("input_fontSize").value);
  const fontFamily = document.getElementById("select_fontFamily").value;
  updateText(selectedNode, text, fontFamily, fontSize);
});

function setUIValAdjustText(val) {
  document.getElementById("input_adjustText").value = val;
}

// Font Size
document.getElementById("input_fontSize").addEventListener("input", (e) => {
  const text = document.getElementById("input_adjustText").value;
  const fontSize = parseInt(document.getElementById("input_fontSize").value);
  const fontFamily = document.getElementById("select_fontFamily").value;
  updateText(selectedNode, text, fontFamily, fontSize);
});

function setUIValFontSize(val) {
  document.getElementById("input_fontSize").value = val;
}

// Font family
document.getElementById("select_fontFamily").addEventListener("change", (e) => {
  const text = document.getElementById("input_adjustText").value;
  const fontSize = parseInt(document.getElementById("input_fontSize").value);
  const fontFamily = document.getElementById("select_fontFamily").value;
  updateText(selectedNode, text, fontFamily, fontSize);
});

function setUIValFontFamily(val) {
  select_fontFamily.value = val;
}

// Text color
function setUIValColor(val) {
  input_textColor.value = val;
}

// Custom Context Menu Logic
const contextMenu = document.getElementById("ctxMenuParent");

// Show context menu on right-click
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
layer.on("contextmenu", function (e) {
  e.evt.preventDefault();

  selectNode(e.target);

  const pointerPos = stage.getPointerPosition();
  const containerRect = stage.container().getBoundingClientRect();

  contextMenu.style.left = containerRect.left + pointerPos.x + "px";
  contextMenu.style.top = containerRect.top + pointerPos.y + "px";
  contextMenu.style.visibility = "visible";
});

contextMenu.addEventListener("click", (e) => {
  const action = e.target.getAttribute("data-action");
  switch (action) {
    case "moveUp":
      selectedNode.moveUp();
      break;
    case "moveDown":
      selectedNode.moveDown();
      break;
    case "moveToBottom":
      selectedNode.moveToBottom();
      break;
    case "moveToTop":
      selectedNode.moveToTop();
      break;
  }
  layer.draw();
  contextMenu.style.visibility = "hidden";
});

// Hide menu on click elsewhere
document.addEventListener("click", (e) => {
  if (!contextMenu.contains(e.target)) {
    contextMenu.style.visibility = "hidden";
  }
});

// Project panel
const widthInput = document.getElementById("canvas-width-input");
const heightInput = document.getElementById("canvas-height-input");

widthInput.value = stage.width();
heightInput.value = stage.height();

document.getElementById("resize-canvas-btn").addEventListener("click", () => {
  const newWidth = parseInt(widthInput.value, 10);
  const newHeight = parseInt(heightInput.value, 10);
  resizeStage(stage, widthInput.value, heightInput.value);
  updateExportSizeLabel();
});

document.querySelectorAll("#aspectRatioMenu > li").forEach((item) => {
  item.addEventListener("click", () => {
    widthInput.value = item.dataset.width;
    heightInput.value = item.dataset.height;
    resizeStage(stage, item.dataset.width, item.dataset.height);
    updateExportSizeLabel();
  });
});

// --- Zoom Controls for Stage Size ---
const zoomSizeStep = 1.2;
document.getElementById("zoom-in-btn").addEventListener("click", () => {
  zoomStageSize(zoomSizeStep);
});
document.getElementById("zoom-out-btn").addEventListener("click", () => {
  zoomStageSize(1 / zoomSizeStep);
});
function zoomStageSize(factor) {
  scaleStage(stage, factor, true);
  //document.getElementById("canvas-width-input").value = stage.width();
  //document.getElementById("canvas-height-input").value = stage.height();
}

// --- Export Size Slider Logic ---
const exportSizeSlider = document.getElementById("export-size-slider");
const exportSizeLabel = document.getElementById("export-size-label");
let exportSizeValue = parseInt(exportSizeSlider.value, 10);

function updateExportSizeLabel() {
  // Get current stage dimensions and aspect ratio
  const stageWidth = stage.width();
  const stageHeight = stage.height();

  exportSizeLabel.textContent = stageWidth + "px * " + stageHeight + "px";
  exportSizeSlider.value = stageWidth < stageHeight ? stageWidth : stageHeight;
}
exportSizeSlider.addEventListener("input", (e) => {
  exportSizeValue = parseInt(e.target.value, 10);
  updateExportSizeLabel();
});

updateExportSizeLabel();

// --- Download with Custom Size ---
document.getElementById("downloadBtn").addEventListener("click", () => {
  transformer.nodes([]);
  layer.draw();

  // Get current stage dimensions and aspect ratio
  const stageWidth = stage.width();
  const stageHeight = stage.height();

  // Export at selected size
  const dataURL = stage.toDataURL({
    width: stageWidth,
    height: stageHeight,
    pixelRatio: widthInput.value / stageWidth,
  });

  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = dataURL;
  link.click();
});

// Export stage
function exportToJSON() {
  const jsonStr = exportToJSONWithVariablePlaceholders(stage);
  return convertToTemplateSyntax(JSON.stringify(JSON.parse(jsonStr), null, 4));
}

// variable utils
/**
 * Extracts all the variables from provided text.
 * E.g. Hello {{ name1 | "John Doe" }}, I am {{ name2 }}
 * will return [{var: name1, default: John Doe}, {var: name2}]
 *
 * default value is optional, if not present, null will be returned.
 *
 * @param {string} text
 * @returns {Array<{var: string, default: string}>}
 */
function extractValuesFromText(text) {
  const matches = text.match(userRegex);
  if (!matches) return [];

  return matches.map((match) => {
    const [_, varName, defaultValue] = match.match(userRegex);
    return { var: varName, default: defaultValue };
  });
}

/**
 * Converts user-friendly shorthand to Go template syntax.
 * @param {string} text - The raw input string (e.g., "Hello {{ name | John }}").
 * @returns {string} The formatted Go template string (e.g., "Hello {{ vars.name | default "John" }}").
 */
function convertToTemplateSyntax(text) {
  return text.replace(
    userRegex,
    (match, complete, varName, defaultValue, offset) => {
      const trimmedVar = varName.trim();
      // Only add the default part if a value actually exists
      const trimmedDefault = defaultValue ? defaultValue.trim() : null;

      return trimmedDefault
        ? `{{ vars.${trimmedVar} | default "${trimmedDefault}" }}`
        : `{{ vars.${trimmedVar} }}`;
    },
  );
}

/**
 * Reverts Go template syntax back to user-friendly shorthand.
 * @param {string} text - The Go template string (e.g., "{{ vars.name | default "John" }}").
 * @returns {string} The simplified user-facing string (e.g., "{{ name | John }}").
 */
function convertToVariableSyntax(text) {
  return text.replace(goRegex, (match, complete, varName, defaultValue) => {
    // If defaultValue exists, it was captured from inside the quotes
    return defaultValue
      ? `{{ ${varName} | ${defaultValue} }}`
      : `{{ ${varName} }}`;
  });
}
