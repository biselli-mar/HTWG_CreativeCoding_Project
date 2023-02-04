class TransMorph extends AnimationMode {
    static readParams() {
        lines = textInput.value().split("\n");
        printText = lines[0];
        fontSizeFactor = fontSizeSlider.value();
        lerpGrowth = 0.05 * map(lerpGrowthSlider.value(), 0.3, 5, 5, 0.3);
        letterSpacing = letterSpacingSlider.value();
        lineSpacing = lineSpacingSlider.value();
        alphaFade = alphaFadeSlider.value();
        alphaMax = alphaMaxSlider.value();
        alphaMin = 0;
    }

    static setupUI() {
        select("#infotext-morph").style("display", "block");
        alphaMaxSlider.parent().parentElement.style.display = "";
        alphaFadeSlider.parent().parentElement.style.display = "";
        lerpGrowthSlider.parent().parentElement.style.display = "";
    }

    static unloadUI() {
        select("#infotext-morph").style("display", "none");
        alphaMaxSlider.parent().parentElement.style.display = "none";
        alphaFadeSlider.parent().parentElement.style.display = "none";
        lerpGrowthSlider.parent().parentElement.style.display = "none";
    }

    static setup() {
        //background(backgroundColor);
        stroke(accentColor);
        randomSeed(random(100000));
        if (pathCount == undefined || fontChanged) {
            let firstLetter_path = font().textToPoints('G', 0, 0, fontSize, {
                sampleFactor: firstLetterFontSampleFactor
            });
            pathCount = firstLetter_path.length;
        }

        for (aline of lines) {
            for (achar of aline) {
                if ((!(achar in paths) || (achar in paths && paths[achar].length != pathCount) || fontChanged)
                    && achar != SPACE && achar != "\n") {
                    let fontSampleFactor = firstLetterFontSampleFactor;
                    let path = font().textToPoints(achar, 0, 0, fontSize, {
                        sampleFactor: firstLetterFontSampleFactor
                    });
                    while (path.length != pathCount) {
                        fontSampleFactor *= pathCount / path.length;
                        path = font().textToPoints(achar, 0, 0, fontSize, {
                            sampleFactor: fontSampleFactor
                        });
                    }
                    paths[achar] = path;
                }
            }
        }
    }
}