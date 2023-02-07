// NEU
let slideItemName = "cc-editor-item-slide-";
let slideItemCount = 3;
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
        "themeSelect": 2
    }
    static getSelector(name) {
        return slideSelectors[SlideSelect.selectorNameMap[name]];
    }
}

function setMode(mode, elem) {
    drawingActive = false;
    clear();
    currentLine = 0;
    printText = lines[0];
    startDrawingButton.removeClass("active");
    morphMode.unloadUI();
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
                noiseParticles = [];
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

function setTheme(theme) {
    if (theme != undefined) {
        while (themeSelect.value != "Custom") {
            themeSelect.nextSlide();
        }
    }
    switch (themeSelect.value) {
        case "Light":
            themeColor = "transparent";
            backgroundColor = color(colorThemeMap["transparent"].base);
            backgroundColor.setAlpha(255);
            accentColor = color(colorThemeMap["transparent"].accent);
            accentColor.setAlpha(255);
            break;
        case "Dark":
            themeColor = "transparent";
            backgroundColor = color(colorThemeMap["transparent"].accent);
            backgroundColor.setAlpha(255);
            accentColor = color(colorThemeMap["transparent"].base);
            accentColor.setAlpha(255);
            break;
        case "Random":
            themeColor = random(allColorThemes);
            backgroundColor = color(colorThemeMap[themeColor].base);
            backgroundColor.setAlpha(255);
            accentColor = color(colorThemeMap[themeColor].accent);
            accentColor.setAlpha(255);
            break;
        case "Custom":
            if (themeColor == undefined && theme == undefined) {
                themeColor = "transparent";
            } else if (theme != undefined) {
                themeColor = theme;
            }
            backgroundColor = color(colorThemeMap[themeColor].base);
            backgroundColor.setAlpha(255);
            accentColor = color(colorThemeMap[themeColor].accent);
            accentColor.setAlpha(255);
            break;
        default:
            throw "Unknown theme!";
    }
    document.querySelector(":root").style.setProperty("--base", backgroundColor.toString('#rrggbb'));
    document.querySelector(":root").style.setProperty("--accent", accentColor.toString('#rrggbb'));
}

function checkAnimationMode() {
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
//---

function initTooltipSlider(elem, tooltip, tooltipId) {
    tooltip = select(tooltipId);
    setupTooltip(elem.elt.parentElement.parentElement, tooltip);
    elem.mouseOver(() => { setupTooltip(elem.elt.parentElement.parentElement, tooltip); tooltip.style("display", "flex"); });
    elem.mouseOut(() => { tooltip.hide(); });
}

function initTooltipSelect(elem, tooltip, tooltipId) {
    tooltip = select(tooltipId);
    setupTooltip(elem.element.elt.parentElement, tooltip);
    elem.element.mouseOver(() => { setupTooltip(elem.element.elt.parentElement, tooltip); tooltip.style("display", "flex"); });
    elem.element.mouseOut(() => { tooltip.hide(); });
}

function setupTooltip(element, tooltip) {
    let offset = element.getBoundingClientRect();
    tooltip.position(offset.left + element.offsetWidth + 29, offset.top - 5);
    tooltip.style("width", str(element.offsetWidth / 2) + "px");
    tooltip.hide();
}

function initializeUI() {
    SlideSelect.slideSetup();

    textInput = select("#newText");
    textInput.value("Elusive\nType");

    fontSizeSlider = select("#fontSizeSlider");
    fontSizeSlider.changed(() => { fontChanged = true; });
    fontSizeSlider.value(1);
    initTooltipSlider(fontSizeSlider, fontSizeTooltip, "#fontSizeTooltip");

    lineWidthSlider = select("#lineWidthSlider");
    lineWidthSlider.value(1);
    initTooltipSlider(lineWidthSlider, lineWidthTooltip, "#lineWidthTooltip");

    lerpGrowthSlider = select("#lerpGrowthSlider");
    lerpGrowthSlider.value(4.7);
    initTooltipSlider(lerpGrowthSlider, lerpGrowthTooltip, "#lerpGrowthTooltip");

    letterSpacingSlider = select("#letterSpacingSlider");
    letterSpacingSlider.value(0.5);
    initTooltipSlider(letterSpacingSlider, letterSpacingTooltip, "#letterSpacingTooltip");

    lineSpacingSlider = select("#lineSpacingSlider");
    lineSpacingSlider.value(1);
    initTooltipSlider(lineSpacingSlider, lineSpacingTooltip, "#lineSpacingTooltip");

    alphaFadeSlider = select("#alphaFadeSlider");
    alphaFadeSlider.value(0.9);
    initTooltipSlider(alphaFadeSlider, alphaFadeTooltip, "#alphaFadeTooltip");

    alphaMaxSlider = select("#alphaMaxSlider");
    alphaMaxSlider.value(170);
    initTooltipSlider(alphaMaxSlider, alphaMaxTooltip, "#alphaMaxTooltip");

    shapeEvolveProgressSlider = select("#shapeEvolveProgressSlider");
    shapeEvolveProgressSlider.value(5);
    shapeEvolveProgressSlider.changed(() => {
        startDrawing();
    });

    letterNoiseSlider = select("#letterNoiseSlider");
    letterNoiseSlider.value(0);
    initTooltipSlider(letterNoiseSlider, letterNoiseTooltip, "#letterNoiseTooltip");

    noiseOpacityFalloffSlider = select("#noiseOpacityFalloffSlider");
    noiseOpacityFalloffSlider.value(1);
    initTooltipSlider(noiseOpacityFalloffSlider, noiseOpacityFalloffTooltip, "#noiseOpacityFalloffTooltip");

    fontSelect = SlideSelect.getSelector("fontSelect");
    fontSelect.element.mouseClicked(() => { fontChanged = true; });
    initTooltipSelect(fontSelect, fontTooltip, "#fontTooltip");

    textAlignSelect = SlideSelect.getSelector("textAlignSelect");
    initTooltipSelect(textAlignSelect, textAlignTooltip, "#textAlignTooltip");

    themeSelect = SlideSelect.getSelector("themeSelect");

    startDrawingButton = select("#startButton");
    startDrawingButton.mousePressed(() => { startDrawingButton.addClass("active"); });

    resetButton = select("#resetButton");
    resetButton.mousePressed(() => { resetButton.addClass("active"); });
    resetButton.mouseReleased(() => { resetButton.removeClass("active"); });

    saveButton = select("#saveButton");
    saveButton.mousePressed(() => { saveButton.addClass("active"); });

    noiseStopButton = select("#mode-noise-stop");
    noiseResumeButton = select("#mode-noise-resume");

    themeButtons = selectAll(".cc-editor-colorbox");
    themeButtons.forEach((elem) => {
        elem.mousePressed(() => {
            setTheme(elem.elt.id.split("-")[1]);
        });
    });
}

function activateSaveButton() {
    saveButton.addClass("active");
}

function deactivateSaveButton() {
    saveButton.removeClass("active");
}
