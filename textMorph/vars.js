// ======== Font Vars ========
let fontPool = ["Amatic", "Anton", "Crimson", 
                "FlowCircular", "LatoBlack", "LatoThin", 
                "Lobster", "NotoSerifBold", "NotoSerifItalic",
                "Playfair", "PlayfairBold", "RalewayBold",
                "RalewayEL", "RubikMono", "SpecialElite", "YesevaOne"];
let loadedFonts = {};
let firstLetterFontSampleFactor = 0.5;
let fontSize;
let pathCount = undefined;

// ======== Animation Vars ========
var canvas;

let loadingText;

let colorStyle;
let backgroundColor;
let accentColor;

let animationMode = HorizontalTransMorph;
let morphMode = TransMorph;

let prevX = 0;
let prevY = 0;
let currentChar = 0;
let lerpAmount = 0;

let x;
let y;

let spacingFactor;

// UI controlled
let lerpGrowth = 1;
let letterSpacing = 2;
let lineSpacing = 2;
let alphaMax = 100;
let alphaMin = 0;
let alphaFade = 1;
let drawVertical = false;
let fontSizeFactor = 1;
let font;

// shapeMode evolution progress
const shapeEvolveCap = 10;
const shapeEvolveGain = 0.2;
let shapeEvolveProgress = 5;


// ======== Text Vars ========
let printText = "Creative\nCoding";
let lines = printText.split("\n");;
let currentLine = 0;
let paths = {};

let SPACE = " ";

// ======== UI Vars ========
let lerpGrowthSlider;
let letterSpacingSlider;
let lineSpacingSlider;
let lineWidthSlider;
let alphaFadeSlider;
let alphaMaxSlider;
let alphaMinSlider;
let fontSizeSlider;
let shapeEvolveProgressSlider;
let letterNoiseSlider;

let fontSelect;
let textAlignSelect;
let textOrientationSelect;
let themeSelect;

let startDrawingButton;
let resetButton;
let saveButton;

let drawingActive = false;
let fontChanged = false;

let textInput;

let sliderCount = 6;
let sliderWidth;
let sliderPadding = 10;

let UI_HEIGHT;

var aline = "";
var achar = '';