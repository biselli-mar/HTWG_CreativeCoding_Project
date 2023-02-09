class HorizontalShapeMorph extends ShapeMorph {
    static drawMode = this.LeftBound;

    static nextX(index = currentChar) {
        return letterSpacing * spacingFactor + letterSpacing * textWidth(printText[index]);
    }

    static draw() { }; // This is a function pointer

    static setup() {
        super.readParams();

        spacingFactor = height / 6;

        fontSize = int(height / 5);
        textAlign(LEFT);
        textSize(fontSize);
        textFont(font());

        // split the text into lines
        lines = textInput.value().split("\n").map(s => s.trim());
        // filter out empty lines
        lines = lines.filter(line => line.length > 0);

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

        fontSize *= fontSizeFactor

        textSize(fontSize);

        switch (textAlignSelect.value) {
            case "Left":
                this.drawMode = this.LeftBound;
                break;
            case "Center":
                this.drawMode = this.CenterBound;
                break;
            case "Right":
                this.drawMode = this.RightBound;
                break;
            default:
                throw "Error: Invalid textAlignSelect value";
        }

        this.drawMode.setup();
        this.draw = this.drawMode.draw;

        super.setup();
    }

    static LeftBound = class {
        static setup() {
            currentChar = 0;
            printText = lines[currentLine];
            x = 0;
            y = getNextY();
        }

        static draw() {
            if (currentChar == printText.length - 1) {
                drawLetter(
                    printText[currentChar] + str(shapeEvolveProgress),
                    x + this.nextX(), y
                );
                if (currentLine < lines.length - 1) {
                    currentLine++;
                    this.LeftBound.setup();
                } else {
                    finishDrawing();
                    return;
                }
            } else {
                prevX = x;
            }
            if (currentChar > 0) {
                x = prevX + this.nextX(currentChar - 1);
            }
            drawLetter(printText[currentChar] + str(shapeEvolveProgress), x, y);
            if (printText[currentChar + 1] == SPACE) {
                x += textWidth('A');
                currentChar++
                while (printText[currentChar + 1] == SPACE) {
                    x += textWidth('A');
                    currentChar++;
                }
            }
            currentChar++;
        }
    }

    static CenterBound = class {
        static setup() {
            printText = lines[currentLine];
            let proceedingTextWidth = 0;
            if (printText.length % 2 == 0) {
                for (currentChar = 0; currentChar < printText.length / 2; currentChar++) {
                    proceedingTextWidth += HorizontalShapeMorph.nextX();
                }
            } else {
                for (currentChar = 0; currentChar < ceil(printText.length / 2); currentChar++) {
                    if (currentChar == ceil(printText.length / 2) - 1) {
                        proceedingTextWidth += HorizontalShapeMorph.nextX() - 0.5 * textWidth(printText[currentChar])
                    } else {
                        proceedingTextWidth += HorizontalShapeMorph.nextX();
                    }
                }
            }
            currentChar = 0;
            x = width / 2 - proceedingTextWidth;
            y = getNextY();
        }

        static draw() {
            if (currentChar == printText.length - 1) {
                drawLetter(
                    printText[currentChar] + str(shapeEvolveProgress),
                    x + this.nextX(), y
                );
                if (currentLine < lines.length - 1) {
                    currentLine++;
                    this.CenterBound.setup();
                } else {
                    drawingActive = false;
                    return;
                }
            } else {
                prevX = x;
            }

            if (currentChar > 0) {
                x = prevX + this.nextX(currentChar - 1);
            }
            drawLetter(printText[currentChar] + str(shapeEvolveProgress), x, y);
            if (printText[currentChar + 1] == SPACE) {
                x += textWidth('A');
                currentChar++
                while (printText[currentChar + 1] == SPACE) {
                    x += textWidth('A');
                    currentChar++;
                }
            }
            currentChar++;
        }
    }

    static RightBound = class {
        static setup() {
            lerpAmount = 0;
            printText = lines[currentLine];
            let proceedingTextWidth = 0;
            for (currentChar = 0; currentChar < printText.length; currentChar++) {
                proceedingTextWidth += HorizontalTransMorph.nextX();
            }
            currentChar = 0;
            x = width - proceedingTextWidth;
            y = getNextY();
        }

        static draw() {
            if (currentChar == printText.length - 1) {
                drawLetter(
                    printText[currentChar] + str(shapeEvolveProgress),
                    x + this.nextX(), y
                );
                if (currentLine < lines.length - 1) {
                    currentLine++;
                    this.RightBound.setup();
                } else {
                    finishDrawing();
                    return;
                }
            } else {
                prevX = x;
            }
            if (currentChar > 0) {
                x = prevX + this.nextX(currentChar - 1);
            }
            drawLetter(printText[currentChar] + str(shapeEvolveProgress), x, y);
            if (printText[currentChar + 1] == SPACE) {
                x += textWidth('A');
                currentChar++
                while (printText[currentChar + 1] == SPACE) {
                    x += textWidth('A');
                    currentChar++;
                }
            }
            currentChar++;
        }
    }
}