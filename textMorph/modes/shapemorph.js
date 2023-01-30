class ShapeMorph extends AnimationMode {
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

        shapeEvolveProgress = shapeEvolveProgressSlider.value();
    }

    static setupUI() {
        select("#mode-params-evolution").style("display", "block");
        select("#mode-specific-param-head").style("display", "block");
    }

    static setup() {
        //background(backgroundColor);
        stroke(accentColor);

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
                    let i = 0;
                    let fontSampleFactor = 0.005;
                    let currentFont = font();
                    for (let lerp = 0; lerp < shapeEvolveGain * shapeEvolveCap; lerp += shapeEvolveGain) {
                        let path = currentFont.textToPoints(achar, 0, 0, fontSize, {
                            sampleFactor: fontSampleFactor
                        });
                        paths[achar + str(i)] = path;
                        fontSampleFactor += (30 ** (lerp - 2.5));
                        i++;
                    }
                }
            }
        }    
    }
}