// NEU
let slideItemName = "cc-editor-item-slide-";
let slideItemCount = 4;
let slideSelectorName = "cc-editor-slide-container";
let slideSelectors = [];

class SlideSelect {
    element;
    selectedSlide;
    slides;

    constructor(indexPos) {
        this.slides = selectAll('.' + slideItemName + indexPos);
        this.element = selectAll('.' + slideSelectorName)[indexPos];
        this.selectedSlide = 0;
        
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].elt.style.display = "none";
        }
        this.slides[this.selectedSlide].elt.style.display = "block";
    }

    /**
     * @returns {p5.Element}
     */
    get element() { return this.element; }

    /**
     * @returns {p5.Element}
     */
    get selectedSlide() { return this.slides[this.selectedSlide]; }

    /**
     * @returns {p5.Element[]}
     */
    get slides() { return this.slides; }

    get value() {
        return this.slides[this.selectedSlide].elt.children[0].innerText;
    }

    nextSlide() {
        this.slides[this.selectedSlide].elt.style.display = "none";
        this.selectedSlide = (this.selectedSlide + 1) % this.slides.length;
        this.slides[this.selectedSlide].elt.style.display = "block";
    }

    prevSlide() {
        this.slides[this.selectedSlide].elt.style.display = "none";
        let nextIndex = this.selectedSlide - 1;
        if (nextIndex < 0) {
            nextIndex = this.slides.length - 1;
        }
        this.selectedSlide = nextIndex;
        this.slides[this.selectedSlide].elt.style.display = "block";
    }

    static slideSetup() {
        for (let i = 0; i < slideItemCount; i++) {
            slideSelectors[i] = new SlideSelect(i);
        }
    }

    static nextSlide(indexPos) {
        slideSelectors[indexPos].nextSlide();
    }

    static prevSlide(indexPos) {
        slideSelectors[indexPos].prevSlide();
    }

    static selectorNameMap = {
        "fontSelect": 0,
        "textAlignSelect": 1,
        "textOrientationSelect": 2,
        "themeSelect": 3
    }
    static getSelector(name) {
        return slideSelectors[SlideSelect.selectorNameMap[name]];
    }
}

function setMode(mode, elem) {
    switch (mode) {
        case "Textmode":
            if (morphMode != TransMorph) {
                morphMode = TransMorph;
                paths = {};
            }
            break;
        case "Evolution":
            if (morphMode != ShapeMorph) {
                morphMode = ShapeMorph;
                paths = {};
            }
            break;
        case "Noise":
            if (morphMode != Noise) {
                morphMode = Noise;
                paths = {};
            }
            break;
        default:
            break;
    }
    morphMode.setupUI();
    document.getElementsByClassName("cc-editor-menu-item active")[0].classList.remove("active");
    elem.classList.add("active");
    checkAnimationMode();
}

function checkAnimationMode() {
    if (textOrientationSelect.value == "Top to Bottom") {
        if (morphMode == TransMorph) {
            animationMode = VerticalTransMorph;
        } else {
            throw "Mode not implemented for vertical text orientation!"
        }
    } else {
        if (morphMode == TransMorph) {
            animationMode = HorizontalTransMorph;
        } else if (morphMode == ShapeMorph) {
            animationMode = HorizontalShapeMorph;
        } else if (morphMode == Noise) {
            animationMode = DefaultNoise;
        } else {
            throw "Unknown morph mode!"
        }
    }
}
//---

function initializeUI() {
    SlideSelect.slideSetup();

    textInput = select("#newText");
    textInput.value("Creative\nCoding");

    fontSizeSlider = select("#fontSizeSlider");
    fontSizeSlider.changed(() => { fontChanged = true; });
    fontSizeSlider.value(1);

    lineWidthSlider = select("#lineWidthSlider");
    lineWidthSlider.value(2);

    lerpGrowthSlider = select("#lerpGrowthSlider");
    lerpGrowthSlider.value(4);

    letterSpacingSlider = select("#letterSpacingSlider");
    letterSpacingSlider.value(0.5);

    lineSpacingSlider = select("#lineSpacingSlider");
    lineSpacingSlider.value(1);

    alphaFadeSlider = select("#alphaFadeSlider");
    alphaFadeSlider.value(1);

    alphaMaxSlider = select("#alphaMaxSlider");
    alphaMaxSlider.value(100);

    shapeEvolveProgressSlider = select("#shapeEvolveProgressSlider");
    shapeEvolveProgressSlider.value(5);
    shapeEvolveProgressSlider.changed(() => {
       startDrawing();
    });

    letterNoiseSlider = select("#letterNoiseSlider");
    letterNoiseSlider.value(0);

    fontSelect = SlideSelect.getSelector("fontSelect");
    fontSelect.element.mouseClicked(() => { fontChanged = true; });
    textAlignSelect = SlideSelect.getSelector("textAlignSelect");
    textOrientationSelect = SlideSelect.getSelector("textOrientationSelect");
    themeSelect = SlideSelect.getSelector("themeSelect");

    startDrawingButton = select("#startButton");
    startDrawingButton.mousePressed(() => { startDrawingButton.addClass("active"); });

    resetButton = select("#resetButton");
    resetButton.mousePressed(() => { resetButton.addClass("active"); });
    resetButton.mouseReleased(() => { resetButton.removeClass("active"); });

    saveButton = select("#saveButton");
    saveButton.mousePressed(() => { saveButton.addClass("active"); });
}

function showLoadingMessage() {
    loadingText.style("display", "block");
    startDrawingButton.addClass("active");
}

function hideLoadingMessage() {
    loadingText.style("display", "none");
    startDrawingButton.removeClass("active");
}

function activateSaveButton() {
    saveButton.addClass("active");
}

function deactivateSaveButton() {
    saveButton.removeClass("active");
}