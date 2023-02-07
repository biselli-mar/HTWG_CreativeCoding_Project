// ======== Font Vars ========
let fontPool = ["Amatic", "Anton", "Crimson", 
                "LatoBlack", "LatoThin", "Lobster", 
                "NotoSerifBold", "NotoSerifItalic", "Playfair",
                "PlayfairBold", "RalewayBold", "RalewayEL",
                "RubikMono", "SpecialElite", "YesevaOne"];
let loadedFonts = {};
let firstLetterFontSampleFactor = 0.5;
let fontSize;
let pathCount = undefined;

// ======== Animation Vars ========
var canvas;

let colorStyle;
let backgroundColor;
let accentColor;

let animationMode = HorizontalTransMorph;
let morphMode = TransMorph;

let prevX = 0;
let prevY = 0;
let currentChar = 0;
let lerpAmount = 0;

let randomNoiseSeed;

let x;
let y;

let spacingFactor;

// UI controlled
let lerpGrowth = 1;
let letterSpacing = 2;
let lineSpacing = 2;
let alphaMax = 100;
let prevAlphaMax;
let alphaMin = 0;
let alphaFade = 1;
let drawVertical = false;
let fontSizeFactor = 1;
let font;
let themeColor;

// shapeMode evolution progress
const shapeEvolveCap = 10;
const shapeEvolveGain = 0.2;
let shapeEvolveProgress = 5;

// noiseMode vars
let noiseScale = 20;
let noiseCols, noiseRows;
let noiseZoff = 0;
let flowfield;
let noiseParticles = [];
let noiseIncrement = 0.15;
let noiseOpacity = 30;
let targetOpacity = 0;

let shownNoiseLineCountWarn = false;

// ======== Text Vars ========
let printText = "Creative\nCoding";
let lines = printText.split("\n");;
let currentLine = 0;
let paths = {};

let SPACE = " ";

let validTextInputRegex = /[a-z0-9!"$%&/()=?*'_:;,\.\-#+~\\\{\}\[\]<> ]/i;

// ======== UI Vars ========
let lerpGrowthSlider;
let lerpGrowthTooltip;
let letterSpacingSlider;
let letterSpacingTooltip;
let lineSpacingSlider;
let lineSpacingTooltip;
let lineWidthSlider;
let lineWidthTooltip;
let alphaFadeSlider;
let alphaFadeTooltip;
let alphaMaxSlider;
let alphaMaxTooltip;

let fontSizeSlider;
let fontSizeTooltip;

let shapeEvolveProgressSlider;
let noiseOpacityFalloffSlider;
let noiseOpacityFalloffTooltip;
let letterNoiseSlider;
let letterNoiseTooltip;

let fontSelect;
let fontTooltip;
let textAlignSelect;
let textAlignTooltip;
let themeSelect;

let startDrawingButton;
let resetButton;
let saveButton;
let themeButtons = [];

let noiseStopButton;
let noiseResumeButton;

let drawingActive = false;
let fontChanged = false;

let textInput;

let sliderCount = 6;
let sliderWidth;
let sliderPadding = 10;

let UI_HEIGHT;

var aline = "";
var achar = '';