class DefaultNoise extends Noise {
    static draw() {
        let noiseYoff = 0;
        for (let y = 0; y < noiseRows; y++) {
            let noiseXoff = 0;
            for (let x = 0; x < noiseCols; x++) {
                let index = x + y * noiseCols;
                let angle = noise(noiseXoff, noiseYoff, noiseZoff) * (PI);
                let v = p5.Vector.fromAngle(angle);
                v.setMag(5);
                flowfield[index] = v;
                noiseXoff += noiseIncrement;
                stroke(accentColor);
                strokeWeight(1);
            }
            noiseYoff += noiseIncrement;
            noiseZoff += 0.0001; //noise geschwindigkeit
        }


        for (let i = 0; i < noiseParticles.length; i++) {
            noiseParticles[i].follow(flowfield);
            noiseParticles[i].update();
            noiseParticles[i].show();
        }

        noiseOpacity -= noiseOpacityFalloffSlider.value() * 0.02;
        if (noiseOpacity < targetOpacity) {
            finishDrawing();
        }
    };

    static setup() {
        super.readParams();

        spacingFactor = height / 8;

        fontSize = int(height / 5);
        textAlign(LEFT);
        textSize(fontSize);

        // split the text into lines
        lines = textInput.value().split("\n").map(s => s.trim());
        // filter out empty lines
        lines = lines.filter(line => line.length > 0);

        if (!shownNoiseLineCountWarn && lines.length > 2) {
            alert("Info: Noise is usually best with 1 or 2 lines of text.\nIf you want more, add spaces to the end of the line or decrease font size for it to fit.")
            shownNoiseLineCountWarn = true;
        }
        // Find the longest line
        let longestLine = lines[0];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].length > longestLine.length) {
                longestLine = lines[i];
            }
        }

        while (textWidth(longestLine) > width / 1.5) {
            fontSize -= 1;
            textSize(fontSize);
        }

        while (textWidth(longestLine) < width / 1.4) {
            fontSize += 1;
            textSize(fontSize);
        }

        fontSize *= fontSizeFactor

        textSize(fontSize);

        super.setup();
    }
}