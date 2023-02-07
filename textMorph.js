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
    divWidth = document.getElementById("canvasForHTML").offsetWidth;
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
    divWidth = document.getElementById("canvasForHTML").offsetWidth;
    divHeight = document.getElementById("canvasForHTML").offsetHeight;
    resizeCanvas(divWidth, divHeight);

    stroke(accentColor);
}

function draw() {
    if (drawingActive) {
        animationMode.draw();
    }
}

// ========== Drawing Controls ===========
function startDrawing() {
    divWidth = document.getElementById("canvasForHTML").offsetWidth;
    divHeight = document.getElementById("canvasForHTML").offsetHeight;
    resizeCanvas(divWidth, divHeight);
    fontChanged = true;
    clear();
    select("#mode-noise-resume").style("display", "none");
    select("#mode-noise-stop").style("display", "");
    noiseSeed(randomNoiseSeed);
    randomSeed(randomNoiseSeed);
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

function stopDrawing() {
    drawingActive = false;
}

function resumeDrawing() {
    drawingActive = true;
}

function resetDrawing() {
    finishDrawing();
    divWidth = document.getElementById("canvasForHTML").offsetWidth;
    divHeight = document.getElementById("canvasForHTML").offsetHeight;
    resizeCanvas(divWidth, divHeight);
    fontChanged = true;
    drawingActive = false;
    clear();
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
    let resolutionFactor = int(prompt("Enter the desired width of the exported image in pixels.\nNOTE! that extremely large resolutions (20.000 pixels or more) might crash your browser", str(divWidth * 8)));
    if (resolutionFactor == null) {
        deactivateSaveButton();
        return;
    }
    resolutionFactor = ceil(resolutionFactor / divWidth);
    saveCanvas('CC-project-textMorph_lowRes_' + year() + day() + '-' + hour() + '-' + minute() + '-' + second(), 'png');
    let prevPixelDensity = pixelDensity();
    push();
    pixelDensity(resolutionFactor);
    startDrawing();
    while (drawingActive) {
        animationMode.draw();
    }
    saveCanvas('CC-project-textMorph_highRes_' + year() + day() + '-' + hour() + '-' + minute() + '-' + second(), 'png');
    pop();
    pixelDensity(prevPixelDensity);
    deactivateSaveButton();
}

// ========== Input Handling ===========
function keyReleased() {
    if (!key.match(validTextInputRegex)) {
        alert("Only alphanumerical characters, spaces and punctuation are allowed.");
        textInput.value(textInput.value().replace(key, '')); // remove the invalid character
    }
}