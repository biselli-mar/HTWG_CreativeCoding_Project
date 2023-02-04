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
            noiseParticles[i].edges();
            noiseParticles[i].show();
        }

        noiseOpacity = noiseOpacity - 0.02;
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

        super.setup();
    }
}