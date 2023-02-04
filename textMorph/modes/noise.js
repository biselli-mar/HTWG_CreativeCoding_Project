class Noise extends AnimationMode {
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
        select("#infotext-noise").style("display", "block");
        select("#mode-specific-param-head").style("display", "block");
        select("#mode-params-noise").style("display", "block");
        alphaMaxSlider.parent().parentElement.style.display = "none";
        letterSpacingSlider.parent().parentElement.style.display = "none";
        lineSpacingSlider.parent().parentElement.style.display = "none";
        lineWidthSlider.parent().parentElement.style.display = "none";

    }
    
    static unloadUI() {
        select("#infotext-noise").style("display", "none");
        select("#mode-specific-param-head").style("display", "none");
        select("#mode-params-noise").style("display", "none");
        alphaMaxSlider.parent().parentElement.style.display = "";
        letterSpacingSlider.parent().parentElement.style.display = "";
        lineSpacingSlider.parent().parentElement.style.display = "";
        lineWidthSlider.parent().parentElement.style.display = "";
    }

    static setup() {
        //background(backgroundColor);
        stroke(accentColor);

        let textW = textWidth(printText[0]);
        let textH = textAscent() + textDescent();

        // noiseMode vars
        noiseScale = 20;
        noiseCols = floor(width / noiseScale);
        noiseRows = floor(height / noiseScale);

        noiseOpacity = 30;

        let prevParticleCount = 0;
        flowfield = new Array(noiseCols * noiseRows);
        noiseParticles = [];

        for (let line = 0; line < lines.length; line++) {
            let path = font().textToPoints(lines[line], 0, 0, fontSize, {
                sampleFactor: firstLetterFontSampleFactor
            });
            for (let i = 0; i < path.length; i++) {
                let pos = path[i];
                noiseParticles[i + prevParticleCount] = new Particle(pos.x + textW, pos.y + textH * (line + 1));
            }
            prevParticleCount += path.length;
        }
    }
}

function Particle(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 0.2;
    
    this.prevPos = this.pos.copy();
    
    this.update = function() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
    
    this.follow = function(vectors) {
      let x = floor(this.pos.x / noiseScale);
      let y = floor(this.pos.y / noiseScale);
      let index = x + y * noiseCols; 
      let force = vectors[index];
      this.applyForce(force);
    }
    
    this.applyForce= function(force) {
      this.acc.add(force);
    }
    
    this.show = function() {
      stroke(105, 162, 151, noiseOpacity);
      //stroke('#ffffff11');
      //stroke(0, 5);
      strokeWeight(1);
      line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
      this.updatePrev();
      point(this.pos.x, this.pos.y);
    }
    
    this.updatePrev = function() {
        this.prevPos.y = this.pos.y;
        this.prevPos.x = this.pos.x;
    }
  }
  
  