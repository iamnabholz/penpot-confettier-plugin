penpot.ui.open("Confettier", `?theme=${penpot.theme}`, {
  width: 280,
  height: 360,
});

let confettiStyle = "all";
let confettiSize = "Small";

const createConfettiShape = (
  positionX: number,
  positionY: number,
  particleSize: number,
  particleColor: string,
  rotation: number,
  skewX: number,
  skewY: number,
) => {
  // Randomly choose a shape type
  let shapeType = Math.floor(Math.random() * 3); // 0: rectangle, 1: circle, 2: triangle

  if (confettiStyle === "triangle") {
    shapeType = 2;
  } else if (confettiStyle === "circle") {
    shapeType = 1;
  } else if (confettiStyle === "square") {
    shapeType = 0;
  }

  const transform = `
    translate(${positionX + particleSize / 2} ${positionY + particleSize / 2})
    scale(${0.7 + Math.random() * 0.6})
    skewX(${skewX})
    skewY(${skewY})
    rotate(${rotation})
    translate(${-(positionX + particleSize / 2)} ${-(positionY + particleSize / 2)})
  `;

  switch (shapeType) {
    case 0: // Rectangle
      return `<rect
        x="${positionX}"
        y="${positionY}"
        width="${particleSize}"
        height="${particleSize * 1.5}"
        fill="${particleColor}"
        transform="${transform}"
        style="opacity: ${0.7 + Math.random() * 0.3}"
      />`;

    case 1: // Circle
      return `<circle
        cx="${positionX + particleSize / 2}"
        cy="${positionY + particleSize / 2}"
        r="${particleSize / 2}"
        fill="${particleColor}"
        transform="${transform}"
        style="opacity: ${0.7 + Math.random() * 0.3}"
      />`;

    case 2: // Triangle
      const points = `
        ${positionX},${positionY + particleSize}
        ${positionX + particleSize / 2},${positionY}
        ${positionX + particleSize},${positionY + particleSize}
      `;
      return `<polygon
        points="${points}"
        fill="${particleColor}"
        transform="${transform}"
        style="opacity: ${0.7 + Math.random() * 0.3}"
      />`;
  }
};

const createConfetti = (width: number, height: number) => {
  const svgHeader = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">`;

  let confettiElements = "";

  // Calculate area and use it to determine confetti count
  const area = width * height;
  // Base density: approximately one confetti per 1000 square pixels
  const baseDensity = 1 / 600;
  // Calculate base count from area and density
  const baseCount = Math.floor(area * baseDensity);
  // Add some randomness while keeping it proportional
  const confettiCount =
    baseCount + Math.floor(Math.random() * (baseCount * 0.4));

  // Ensure minimum and maximum counts
  const minCount = 10;
  const maxCount = 200;
  const finalConfettiCount = Math.min(
    Math.max(confettiCount, minCount),
    maxCount,
  );

  for (
    let particleIndex = 0;
    particleIndex < finalConfettiCount;
    particleIndex++
  ) {
    let particleSize;

    if (confettiSize === "Small") {
      particleSize = 2 + Math.random() * 9;
    } else {
      particleSize = 3 + Math.random() * 15;
    }
    const positionX = Math.random() * width;
    const positionY = Math.random() * height;

    // Multiple rotation angles for 3D-like effect
    const rotation = Math.random() * 360;
    const skewX = Math.random() * 30 - 15;
    const skewY = Math.random() * 30 - 15;
    const particleColor = `hsl(${Math.random() * 360}, 70%, 50%)`;

    const confettiPiece = createConfettiShape(
      positionX,
      positionY,
      particleSize,
      particleColor,
      rotation,
      skewX,
      skewY,
    );

    confettiElements += confettiPiece;
  }

  const svgFooter = "</svg>";
  const completeSvg = svgHeader + confettiElements + svgFooter;

  return completeSvg;
};

const createGroupShape = (
  width: number,
  height: number,
  x: number,
  y: number,
  board: any = null,
) => {
  const shapeGroup = penpot.createShapeFromSvg(createConfetti(width, height));

  if (shapeGroup) {
    shapeGroup.name = `confetti ${width} by ${height}`;
    penpot.flatten(shapeGroup.children);
    shapeGroup.resize(Number(width), Number(height));
    shapeGroup.x = x;
    shapeGroup.y = y;

    if (penpot.utils.types.isBoard(board)) {
      board.insertChild(0, shapeGroup);
    } else if (board.parent) {
      board.parent.insertChild(0, shapeGroup);
    }

    penpot.selection = [shapeGroup];
  }
};

penpot.ui.onMessage<any>((message) => {
  if (message.msg === "generate") {
    const selection = penpot.selection;
    confettiStyle = message.style;
    confettiSize = message.size;

    if (selection.length > 0) {
      selection.forEach((element) => {
        createGroupShape(
          element.width,
          element.height,
          element.x,
          element.y,
          element,
        );
      });
    } else {
      createGroupShape(
        message.width,
        message.height,
        Number(penpot.viewport.center.x - message.width / 2),
        Number(penpot.viewport.center.y - message.height / 2),
      );
    }
  }
});

// Update the theme in the iframe
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});
