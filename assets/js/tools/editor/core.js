const scaleBy = 1.5;

function init() {
  const stage = new Konva.Stage({
    container: "konvaContainer",
    width: 800,
    height: 600,
    // draggable: true,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  let transformer = new Konva.Transformer();
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

  const defaults = node.getAttr("defaults") || {};
  if (path) {
    if (!defaults.path) {
      // first time converting path to variable
      defaults.path = node.getAttr("path");
      node.setAttrs({ defaults });
    }

    node.setAttrs({ path });
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
    selectedNode.text(text);
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
  const baseJson = stage.toJSON();

  return baseJson;
}
