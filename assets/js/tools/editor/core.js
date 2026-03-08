const scaleBy = 1.5;
const variableRegex = /\{\{\s*\.(\w*)\s*}\}/g;

const goRegex = /({{\s*vars\.([\w.-]+)\s*(?:\|\s*default\s*"([^"]*)"\s*)?}})/g;

function init() {
  const stage = new Konva.Stage({
    container: "konvaContainer",
    width: 800,
    height: 600,
    // draggable: true,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  let transformer = new Konva.Transformer({ rotationSnaps: [0, 90, 180, 270] });
  layer.add(transformer);

  return { stage, layer, transformer };
}

// Add image to canvas
function addImage(layer, img, name) {
  const konvaImg = new Konva.Image({
    image: img,
    x: 50,
    y: 50,
    draggable: true,
  });
  // TODO: 700, 500 should be stage width & height not constants
  const scale = Math.min(700 / img.width, 500 / img.height, 1);
  konvaImg.scale({ x: scale, y: scale });
  layer.add(konvaImg);
  layer.draw();

  // custom attrs
  const attrs = {
    path: name,
  };
  konvaImg.setAttrs(attrs);

  return konvaImg;
}

function embedVariablesToImage(node, { path }) {
  if (!node || node.getClassName() != "Image") {
    return;
  }

  if (path) {
    node.setAttrs({ path: path });
  }
}

function unembedVariablesFromImage(node) {
  if (!node || node.getClassName() != "Image") {
    return;
  }

  const vars = extractValuesFromText(node.getAttr("path"));
  if (vars && vars.length > 0) {
    node.setAttrs({ path: vars[0].default_value });
  }
}

function addText(layer, text, fontFamily, fontSize) {
  const konvaText = new Konva.Text({
    text: text,
    x: 100,
    y: 100,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fill: "#ffffff",
    draggable: true,
  });
  // konvaText.on("transform", function () {
  //   konvaText.setAttrs({
  //     width: konvaText.width() * konvaText.scaleX(),
  //     scaleX: 1,
  //   });
  // });
  layer.add(konvaText);
  layer.draw();

  return konvaText;
}

function updateText(selectedNode, text, fontFamily, fontSize) {
  if (!selectedNode.getClassName() === "Text") return;

  if (text) {
    const variables = selectedNode.getAttr("variables") || {};
    variables["text"] = text;
    selectedNode.setAttrs({ variables });

    selectedNode.text(resolveVariables(text));
  }
  selectedNode.fontFamily(fontFamily);
  selectedNode.fontSize(fontSize);
  layer.draw();
}

function hasFilter(selectedNode, filter) {
  let fFound = false;
  (selectedNode.filters() || []).forEach((f) => {
    if (f === filter) {
      fFound = true;
    }
  });

  return fFound;
}

// Update slider values and apply filters in real-time
function applyFiltersToSelected(
  selectedNode,
  filters = { brightness: null, contrast: null, blur: null },
) {
  if (selectedNode.getClassName() != "Image") return;

  selectedNode.cache();

  const { brightness, contrast, blur } = filters;
  if (brightness) {
    if (!hasFilter(selectedNode, Konva.Filters.Brighten)) {
      const f = selectedNode.filters() ? selectedNode.filters() : [];
      selectedNode.filters([...f, Konva.Filters.Brighten]);
    }

    selectedNode.brightness(brightness / 100);
  }

  if (contrast) {
    if (!hasFilter(selectedNode, Konva.Filters.Contrast)) {
      const f = selectedNode.filters() ? selectedNode.filters() : [];
      selectedNode.filters([...f, Konva.Filters.Contrast]);
    }
    selectedNode.contrast(contrast);
  }

  if (blur) {
    if (!hasFilter(selectedNode, Konva.Filters.Blur)) {
      const f = selectedNode.filters() ? selectedNode.filters() : [];
      selectedNode.filters([...f, Konva.Filters.Blur]);
    }
    selectedNode.blurRadius(blur);
  }

  layer.batchDraw();
}

function applyQuickFilter(selectedNode, filterType) {
  if (!selectedNode || selectedNode.getClassName() !== "Image") return;

  if (!selectedNode.kriti) selectedNode.kriti = {};

  selectedNode.cache();

  switch (filterType) {
    case "none":
      selectedNode.filters([]);
      selectedNode.kriti.filter = "none";
      break;

    case "grayscale":
      selectedNode.filters([Konva.Filters.Grayscale]);
      selectedNode.kriti.filter = "grayscale";
      break;

    case "sepia":
      selectedNode.filters([Konva.Filters.Brighten, Konva.Filters.Contrast]);
      selectedNode.brightness(-0.1);
      selectedNode.contrast(10);
      // Apply sepia color overlay
      selectedNode.filters([...selectedNode.filters(), Konva.Filters.RGB]);
      selectedNode.red(112);
      selectedNode.green(66);
      selectedNode.blue(20);
      selectedNode.kriti.filter = "sepia";
      break;

    case "invert":
      selectedNode.filters([Konva.Filters.Invert]);
      selectedNode.kriti.filter = "invert";
      break;

    case "vintage":
      selectedNode.filters([
        Konva.Filters.Brighten,
        Konva.Filters.Contrast,
        Konva.Filters.RGB,
      ]);
      selectedNode.brightness(-0.15);
      selectedNode.contrast(15);
      selectedNode.red(110);
      selectedNode.green(80);
      selectedNode.blue(60);
      selectedNode.kriti.filter = "vintage";
      break;

    case "cool":
      selectedNode.filters([Konva.Filters.RGB]);
      selectedNode.red(-20);
      selectedNode.green(0);
      selectedNode.blue(30);
      selectedNode.kriti.filter = "cool";
      break;

    case "warm":
      selectedNode.filters([Konva.Filters.RGB]);
      selectedNode.red(30);
      selectedNode.green(10);
      selectedNode.blue(-20);
      selectedNode.kriti.filter = "warm";
      break;

    case "dramatic":
      selectedNode.filters([Konva.Filters.Contrast, Konva.Filters.Brighten]);
      selectedNode.contrast(40);
      selectedNode.brightness(-0.1);
      selectedNode.kriti.filter = "dramatic";
      break;
  }

  layer.batchDraw();
}

function getFilters(selectedNode) {
  if (!selectedNode)
    return { type: "none", filters: { brightness: 0, contrast: 0, blur: 0 } };

  return {
    type: selectedNode.kriti?.filter || "none",
    filters: {
      brightness: selectedNode.brightness() * 100,
      contrast: selectedNode.contrast(),
      blur: selectedNode.blurRadius(),
    },
  };
}

function getTransformation(selectedNode) {
  if (!selectedNode) return { rotation: 0 };

  return {
    rotation: selectedNode.rotation(),
  };
}

function rotate(selectedNode, angle) {
  if (!selectedNode) return;
  selectedNode.rotation(angle);
  layer.draw();
}

function resizeStage(stage, width = 1080, height = 1080) {
  const newWidth = parseInt(width, 10);
  const newHeight = parseInt(height, 10);

  if (newWidth > 0 && newHeight > 0) {
    stage.width(newWidth);
    stage.height(newHeight);
    stage.draw();
  }
}

function scaleStage(stage, factor = 1, scaleContent = true) {
  const oldWidth = stage.width();
  const oldHeight = stage.height();
  const aspect = oldWidth / oldHeight;

  let newWidth = oldWidth * factor;
  let newHeight = newWidth / aspect;

  resizeStage(stage, newWidth, newHeight);
  stage.scale({ x: stage.scaleX() * factor, y: stage.scaleY() * factor });
}

function applyBorderRadiusToSelected(selectedNode, percent) {
  if (!selectedNode || selectedNode.getClassName() !== "Image") return;
  const width = selectedNode.width();
  const height = selectedNode.height();
  const minDim = Math.min(width, height);
  const radius = (percent / 100) * minDim;
  selectedNode.cornerRadius(radius);
  layer.batchDraw();
}

function exportToJSONWithVariablePlaceholders(stage) {
  // Helper to recursively process nodes
  function processNode(nodeJson) {
    // If variables exist, replace attributes with placeholders
    if (nodeJson.attrs && nodeJson.attrs.variables) {
      const variables = nodeJson.attrs.variables;
      for (const attr in variables) {
        nodeJson.attrs[attr] = variables[attr];
      }
      // Optionally, remove the variables object from export
      delete nodeJson.attrs.variables;
    }

    // Recursively process children
    if (nodeJson.children && nodeJson.children.length > 0) {
      nodeJson.children = nodeJson.children.map(processNode);
    }
    return nodeJson;
  }

  const stageObj = JSON.parse(stage.toJSON());
  return processNode(stageObj);
}

// variable utils
/**
 * Extracts all the variables from provided text.
 * E.g. Hello {{ name1 | John Doe }}, I am {{ name2 }}
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
    const x = [...match.matchAll(userRegex)];
    return { variable_name: x[0][2], default_value: x[0][3] };
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

/**
 * Resolves custom variable tags by checking a data object first,
 * then falling back to the provided default value, or finally
 * leaving the tag intact.
 *
 * @param {string} text - The input string (e.g., "Hello {{ name | Guest }}")
 * @param {Object} dataSource - The object containing real values (e.g., { name: "Alice" })
 * @returns {string} The final string with values injected.
 */
function resolveVariables(text, dataSource = {}) {
  // Group 1: Full Tag, Group 2: Var Name, Group 3: Default Value
  const userRegex = /({{\s*([^|}]*?)\s*(?:\|\s*([^}]*?)\s*)?}})/g;

  return text.replace(userRegex, (match, fullTag, varName, defaultValue) => {
    const key = varName.trim();
    const fallback = defaultValue ? defaultValue.trim() : null;

    // 1. Check if the key exists in our data (handling 0 or false as valid values)
    if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
      return dataSource[key];
    }

    // 2. Check if we have a default value in the tag
    if (fallback !== null && fallback.length > 0) {
      return fallback;
    }

    // 3. Keep the original tag if nothing else works
    return fullTag;
  });
}
