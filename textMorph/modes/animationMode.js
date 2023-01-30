class AnimationMode {
    setupUI() {}
    setup() {}
    draw() {}
}

function getNextY() {
    return textAscent("T")/height * height + currentLine * lineSpacing * spacingFactor
}

function finishDrawing() {
    drawingActive = false;
    console.log("Drawing finished");
    hideLoadingMessage();
}