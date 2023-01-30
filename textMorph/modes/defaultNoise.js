class DefaultNoise extends Noise {
    static drawMode = this.LeftBound;

    static nextX() {
        return letterSpacing * spacingFactor + letterSpacing * textWidth(printText[currentChar]);
    }

    static draw() {
        let yoff = 0;
        for (let y = 0; y < rows; y++) {
            let xoff = 0;
            for (let x = 0; x < cols; x++) {
                let index = x + y * cols;
                let angle = noise(xoff, yoff, zoff) * (PI);
                let v = p5.Vector.fromAngle(angle);
                v.setMag(5);
                flowfield[index] = v;
                xoff += inc;
                stroke("#ffaabb");
                strokeWeight(1);
                push();
                translate(x * scl, y * scl);
                rotate(v.heading());
                //line(0, 0, scl, 0);
                strokeWeight(1);
                pop();
                //fill(r);
                //rect(x * scl, y * scl, scl, scl);
            }
            yoff += inc;
            zoff += 0.0001; //noise geschwindigkeit
        }


        for (let i = 0; i < particle.length; i++) {
            particle[i].follow(flowfield);
            particle[i].update();
            particle[i].edges();
            particle[i].show();
        }
        fr.html(floor(frameRate()));

        colorOpacity = colorOpacity - 0.02;
        console.log(colorOpacity);
    };

    static setup() {
        super.readParams();

        spacingFactor = height / 8;

        fontSize = int(height / 5);
        textAlign(LEFT);
        textSize(fontSize);

        // split the text into lines
        lines = textInput.value().split("\n");
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
        //this.draw = this.drawMode.draw;

        super.setup();
    }

    static LeftBound = class {
        static setup() {
            currentChar = 0;
            lerpAmount = 0;
            printText = lines[currentLine];
            x = 0;
            y = getNextY();
        }

        static draw() {
            if (lerpAmount > 1) {
                if (currentChar == printText.length - 2) {
                    accentColor.setAlpha(255);
                    stroke(accentColor);
                    drawLetter(printText[currentChar + 1], x + this.nextX(), y);
                    if (currentLine < lines.length - 1) {
                        currentLine++;
                        this.LeftBound.setup();
                    } else {
                        finishDrawing();
                        return;
                    }
                } else {
                    lerpAmount = 0;
                    currentChar++;
                    prevX = x;
                }
            }
            if (currentChar > 0) {
                x = prevX + this.nextX();
            }
            if (lerpAmount == 0) {
                accentColor.setAlpha(255);
            } else if (lerpAmount < 0.5) {
                accentColor.setAlpha(map(lerpAmount * alphaFade, 0.5, 0, alphaMin, alphaMax));
            } else {
                accentColor.setAlpha(map(lerpAmount ** alphaFade, 0.5, 1, alphaMin, alphaMax, true));
            }
            stroke(accentColor);
            if (printText[currentChar + 1] == SPACE) {
                drawLetter(printText[currentChar], x, y);
                prevX = x - 0.5 * textWidth(SPACE);
                currentChar++
                while (printText[currentChar] == SPACE) {
                    prevX += textWidth(SPACE);
                    currentChar++;
                }
                lerpAmount = 0;
            } else {
                drawLerpedLetter(
                    printText[currentChar], x, y,
                    printText[currentChar + 1], x + this.nextX(), y,
                    lerpAmount
                );
                lerpAmount += lerpGrowth;
            }
        }
    }

    static CenterBound = class {
        static setup() {
            lerpAmount = 0;
            printText = lines[currentLine];
            let proceedingTextWidth = 0;
            if (printText.length % 2 == 0) {
                for (let currentChar = 0; currentChar < printText.length / 2; currentChar++) {
                    proceedingTextWidth += HorizontalTransMorph.nextX();
                }
            } else {
                for (let currentChar = 0; currentChar < ceil(printText.length / 2); currentChar++) {
                    if (currentChar == ceil(printText.length / 2) - 1) {
                        proceedingTextWidth += HorizontalTransMorph.nextX() - 0.5 * textWidth(printText[currentChar])
                    } else {
                        proceedingTextWidth += HorizontalTransMorph.nextX();
                    }
                }
            }
            currentChar = 0;
            x = width / 2 - proceedingTextWidth;
            y = getNextY();
        }

        static draw() {
            if (lerpAmount > 1) {
                if (currentChar == printText.length - 2) {
                    accentColor.setAlpha(255);
                    stroke(accentColor);
                    drawLetter(printText[currentChar + 1], x + this.nextX(), y);
                    if (currentLine < lines.length - 1) {
                        currentLine++;
                        this.CenterBound.setup();
                    } else {
                        finishDrawing();
                        return;
                    }
                } else {
                    lerpAmount = 0;
                    currentChar++;
                    prevX = x;
                }
            }
            if (currentChar > 0) {
                x = prevX + this.nextX();
            }
            if (lerpAmount == 0) {
                accentColor.setAlpha(255);
            } else if (lerpAmount < 0.5) {
                accentColor.setAlpha(map(lerpAmount * alphaFade, 0.5, 0, alphaMin, alphaMax));
            } else {
                accentColor.setAlpha(map(lerpAmount ** alphaFade, 0.5, 1, alphaMin, alphaMax, true));
            }
            stroke(accentColor);
            if (printText[currentChar + 1] == SPACE) {
                drawLetter(printText[currentChar], x, y);
                prevX = x - 0.5 * textWidth(SPACE);
                currentChar++
                while (printText[currentChar] == SPACE) {
                    prevX += textWidth(SPACE);
                    currentChar++;
                }
                lerpAmount = 0;
            } else {
                drawLerpedLetter(
                    printText[currentChar], x, y,
                    printText[currentChar + 1], x + this.nextX(), y,
                    lerpAmount
                );
                lerpAmount += lerpGrowth;
            }
        }
    }

    static RightBound = class {
        static setup() {
            printText = lines[currentLine];
            currentChar = printText.length - 1;
            lerpAmount = 1;
            x = width - 1.2 * textWidth(printText[currentChar]);
            y = getNextY();
        }

        static draw() {
            if (lerpAmount < 0) {
                if (currentChar == 1) {
                    accentColor.setAlpha(255);
                    stroke(accentColor);
                    drawLetter(printText[currentChar - 1], x - this.nextX(), y);
                    if (currentLine < lines.length - 1) {
                        currentLine++;
                        this.RightBound.setup();
                    } else {
                        finishDrawing();
                        return;
                    }
                } else {
                    lerpAmount = 1;
                    currentChar--;
                    prevX = x;
                }
            }
            if (currentChar < printText.length - 1) {
                x = prevX - this.nextX();
            }
            if (lerpAmount == 1) {
                accentColor.setAlpha(255);
            } else if (lerpAmount < 0.5) {
                accentColor.setAlpha(map(lerpAmount * alphaFade, 0.5, 0, alphaMin, alphaMax));
            } else {
                accentColor.setAlpha(map(lerpAmount ** alphaFade, 0.5, 1, alphaMin, alphaMax, true));
            }
            stroke(accentColor);
            if (printText[currentChar - 1] == SPACE) {
                drawLetter(printText[currentChar], x, y);
                prevX = x + 0.5 * textWidth(SPACE);
                currentChar--
                while (printText[currentChar] == SPACE) {
                    prevX -= textWidth(SPACE);
                    currentChar--;
                }
                lerpAmount = 1;
            } else {
                drawLerpedLetter(
                    printText[currentChar - 1], x - this.nextX(), y,
                    printText[currentChar], x, y,
                    lerpAmount
                );
                lerpAmount -= lerpGrowth;
            }
        }
    }
}