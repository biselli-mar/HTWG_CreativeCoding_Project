class VerticalTransMorph extends TransMorph {
    static setup() {
        super.readParams();

        fontSize = int(height / 5);
        textAlign(LEFT);
        textSize(fontSize);
        textFont(font());

        // Find the longest line
        let longestLine = lines[0];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].length > longestLine.length) {
                longestLine = lines[i];
            }
        }

        spacingFactor = height / longestLine.length / 2;

        while (3 * textAscent("A") > (height + UI_HEIGHT) / (0.7 * longestLine.length)) {
            fontSize -= 1;
            textSize(fontSize);
        }

        while (2 * textAscent("A") < (height + UI_HEIGHT) / (0.8 * longestLine.length)) {
            fontSize += 1;
            textSize(fontSize);
        }

        super.setup();

        x = (width / 2) - lines.length / 2 * 1.5 * textWidth("Q");
    }
    static draw() {
        if (lerpAmount > 1) {
            if (currentChar == printText.length - 2) {
                stroke(0, 0, 0, 255);
                drawLetter(printText[currentChar + 1], x, y + letterSpacing * spacingFactor + textAscent(printText[currentChar]));
                if (currentLine < lines.length - 1) {
                    currentLine++;
                    printText = lines[currentLine];
                    currentChar = 0;
                    lerpAmount = 0;
                    x += 1.5 * textWidth("Q");
                    y = UI_HEIGHT;
                } else {
                    drawingActive = false;
                    return;
                }
            } else {
                lerpAmount = 0;
                currentChar++;
                prevY = y;
            }
        }
        let charHeight = 0;
        if (currentChar > 0) {
            charHeight = textAscent(printText[currentChar]);
            y = prevY + charHeight + letterSpacing * spacingFactor;
        }
        if (lerpAmount == 0) {
            stroke(0, 0, 0, 255);
        } else if (lerpAmount < 0.5) {
            stroke(0, 0, 0, map(lerpAmount * alphaFade, 0, 0.5, alphaMax, alphaMin, true))
        } else {
            stroke(0, 0, 0, map(lerpAmount ** alphaFade, 0.5, 1, alphaMin, alphaMax, true))
        }
        if (printText[currentChar + 1] == SPACE) {
            drawLetter(printText[currentChar], x, y);
            prevY = y + 0.75 * textAscent("e");
            currentChar++
            while (printText[currentChar] == SPACE) {
                prevY += 0.75 * textAscent("e");
                currentChar++;
            }
            lerpAmount = 0;
        } else {
            drawLerpedLetter(
                printText[currentChar], x, y,
                printText[currentChar + 1], x, y + letterSpacing * spacingFactor + textAscent(printText[currentChar + 1]),
                lerpAmount
            );
            lerpAmount += lerpGrowth;
        }
    }
}