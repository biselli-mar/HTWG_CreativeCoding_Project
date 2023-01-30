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

    static setup() {
        background(backgroundColor);
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

function Particle(x, y) {
    //this.pos = createVector(random(width), random(height));
    /*
    for (let i = 0; i < 360; i++) {
      this.pos = createVector(10, 20);
    }
    */
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
      let x = floor(this.pos.x / scl);
      let y = floor(this.pos.y / scl);
      let index = x + y * cols; 
      let force = vectors[index];
      this.applyForce(force);
    }
    
    this.applyForce= function(force) {
      this.acc.add(force);
    }
    
    this.show = function() {
      stroke(105, 162, 151, colorOpacity);
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
    
    this.edges = function() {
      if (this.pos.x > width) {
        this.pos.x = 0;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.pos.x = width;
        this.updatePrev();
      }
      if (this.pos.y > height) {
        this.pos.y = 0;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.pos.y = height;
        this.updatePrev();
      }
    }
  }
  
  