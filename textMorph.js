// HTWG       | Creative Coding - Project:
// Constance  |     Typography
//            |     Text Editor
//            |
//            |             Nicolas Müller
//            |             Marcel Biselli
//            |  Winter 2022 / Summer 2023
//
// =======================================
//
// ============== Variables ==============
// vars.js

let divWidth;
let divHeight;

let offset = 400;
var textContent = "a";
let timeCount = 0;

function preload() {
    for (let f of fontPool) {
        loadedFonts[f] = loadFont("/fonts/" + f + ".ttf");
    }
}

function setup() {
    // ========== Canvas Setup ===========
    divWidth  = document.getElementById("canvasForHTML").offsetWidth;
    divHeight = document.getElementById("canvasForHTML").offsetHeight;

    canvas = createCanvas(divWidth, divHeight);
    canvas.parent('canvasForHTML');
    angleMode(DEGREES);
    
    // ===== Setup UI vars and HTML ======
    // ui.js
    initializeUI();

    font = () => { return loadedFonts[fontSelect.value.split(" ").join('')]; };

    let backColor = document.querySelector(".cc-main-body");
    colorStyle = getComputedStyle(backColor);
    backgroundColor = color(colorStyle.backgroundColor);
    backgroundColor.setAlpha(255);
    accentColor = color(colorStyle.color);
    accentColor.setAlpha(255);

    loadingText = createP("Drawing...");
    loadingText.style("display", "none");
    loadingText.parent("canvasForHTML");
    loadingText.style("color", accentColor);
    loadingText.style("font-size", "2em");
    loadingText.style("position", "absolute");
    loadingText.style("top", "50%");
    loadingText.style("left", "50%");
    loadingText.style("transform", "translate(-50%, -50%)");

    // =========== Text Setup ============
    // Initialize the textSize, textAlign and pathCount for specific mode
    animationMode.setup();

    // ========= p5 Canvas Setup =========
    x = 0;
    y = getNextY();

    noFill();
    textAlign(LEFT);
    textFont(font());
    
    fontSize = int(height / 5);
    textAlign(LEFT);
    textSize(fontSize);

    // split the text into lines
    lines = textInput.value().split("\n");
    // filter out empty lines
    lines = lines.filter(line => line.length > 0);

    currentCharCount = 0;
    totalCharCount = textInput.value().length - (lines.length - 1);

    // Find the longest line
    let longestLine = lines[0];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].length > longestLine.length) {
            longestLine = lines[i];
        }
    }

    while (textWidth(longestLine) > width / 2) {
        fontSize -= 1;
        textSize(fontSize);
    }

    while (textWidth(longestLine) < width / 2.3) {
        fontSize += 1;
        textSize(fontSize);
    }

    textSize(fontSize);
    // somehow element width is not loaded properly on first run
    windowResized();

    //background(backgroundColor);
    stroke(accentColor);
}

function windowResized() {
    divWidth  = document.getElementById("canvasForHTML").offsetWidth;
    divHeight = document.getElementById("canvasForHTML").offsetHeight;
    resizeCanvas(divWidth, divHeight);
    fontChanged = true;
}

function draw() {
    if (drawingActive) {
        animationMode.draw();
    }
}

// ========== Drawing Controls ===========
function startDrawing() {
    clear();
    noiseSeed(random(10000));
    setTheme(undefined);

    // split the text into lines
    lines = textInput.value().split("\n");
    // filter out empty lines
    lines = lines.filter(line => line.length > 0);
    
    currentLine = 0;
    printText = lines[0];
    textFont(font());
    
    checkAnimationMode();
    
    animationMode.setup();
    drawingActive = true;
}

function resetDrawing() {
    clear();
    drawingActive = false;
    currentLine = 0;
    printText = lines[0];

    initializeUI();
}

function drawLerpedLetter(letter1, x1, y1, letter2, x2, y2, lerpAmount) {
    let path = paths[letter1];
    let path2 = paths[letter2];

    strokeWeight(lineWidthSlider.value());
    beginShape();

    for (var point = 0; point < path.length; point++) {
        var pos = path[point];
        var pos2 = path2[point];
        pos = createVector(pos.x + x1, pos.y + y1)
        pos2 = createVector(pos2.x + x2, pos2.y + y2)
        var pointVerschoben = p5.Vector.lerp(pos, pos2, lerpAmount);
        let noiseAmount = letterNoiseSlider.value() * textWidth(printText[currentChar]);
        pointVerschoben.add(noise(pointVerschoben.x) * noiseAmount, noise(pointVerschoben.y) * noiseAmount);
        curveVertex(pointVerschoben.x, pointVerschoben.y);
    }

    endShape(CLOSE);
}

function drawLetter(letter, x, y) {
    let path = paths[letter];
    strokeWeight(lineWidthSlider.value());
    beginShape();

    for (var point = 0; point < path.length; point++) {
        var pos = path[point];
        pos = createVector(pos.x + x, pos.y + y)
        let noiseAmount = letterNoiseSlider.value() * textWidth(printText[currentChar]);
        pos.add(noise(pos.x) * noiseAmount, noise(pos.y) * noiseAmount);
        curveVertex(pos.x, pos.y);
    }

    endShape(CLOSE);
}

function downloadCanvas() {
    saveCanvas('CC-project-textMorph_lowRes_'+year()+day()+'-'+hour()+'-'+minute()+'-'+second(),'png');
    push();
    pixelDensity(12);
    startDrawing();
    while (drawingActive) {
        animationMode.draw();
    }
    saveCanvas('CC-project-textMorph_highRes_'+year()+day()+'-'+hour()+'-'+minute()+'-'+second(),'png');
    pop();
    pixelDensity(1);
    deactivateSaveButton();
}