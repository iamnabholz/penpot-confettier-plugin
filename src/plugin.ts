penpot.ui.open("Confettier", `?theme=${penpot.theme}`, {
  width: 240,
  height: 220
});

const createConfetti = (width: number, height: number) => {
  const svgHeader = `<svg viewBox="0 0 ${width} ${height}" 
    xmlns="http://www.w3.org/stg" preserveAspectRatio="xMidYMid meet">`;

  let confettiElements = '';
  const confettiCount = 25 + Math.random() * 30;

  for (let particleIndex = 0; particleIndex < confettiCount; particleIndex++) {
    const particleSize = 2 + Math.random() * 9;
    const positionX = Math.random() * width;
    const positionY = Math.random() * height;

    // Multiple rotation angles for 3D-like effect
    const rotation = Math.random() * 360;
    const skewX = Math.random() * 30 - 15;
    const skewY = Math.random() * 30 - 15;
    const particleColor = `hsl(${Math.random() * 360}, 70%, 50%)`;

    const confettiPiece = `<rect 
      x="${positionX}" 
      y="${positionY}" 
      width="${particleSize}" 
      height="${particleSize * 1.5}" 
      fill="${particleColor}"
      transform="
        translate(${positionX + particleSize / 2} ${positionY + particleSize / 2})
        scale(${0.7 + Math.random() * 0.6})
        skewX(${skewX})
        skewY(${skewY})
        rotate(${rotation})
        translate(${-(positionX + particleSize / 2)} ${-(positionY + particleSize / 2)})
      "
      style="opacity: ${0.7 + Math.random() * 0.3}"
    />`;

    confettiElements += confettiPiece;
  }

  const svgFooter = '</svg>';
  const completeSvg = svgHeader + confettiElements + svgFooter;

  return completeSvg;
}

const createGroupShape = (width: number, height: number, x: number, y: number) => {
  const shapeGroup = penpot.createShapeFromSvg(createConfetti(width, height));

  if (shapeGroup) {
    shapeGroup.name = `confetti ${width}px by ${height}px`;
    penpot.flatten(shapeGroup.children);
    shapeGroup.x = x;
    shapeGroup.y = y;

    penpot.selection = [shapeGroup];
  }
}

penpot.ui.onMessage<any>((message) => {
  if (message.msg === "generate") {
    const selection = penpot.selection;
    console.log(selection);
    if (selection.length > 0) {
      selection.forEach((element) => {
        createGroupShape(element.width, element.height, element.x, element.y);
      })
    } else {
      createGroupShape(message.width, message.height, penpot.viewport.center.x, penpot.viewport.center.y);
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
