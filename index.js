'use strict';

// Global variables for classifier URLs
var maleFemaleModelURL = 'https://teachablemachine.withgoogle.com/models/WcPZrRo4l/';
var glassesModelURL = 'https://teachablemachine.withgoogle.com/models/w9NprxFXq/';
var ageModelURL = 'https://teachablemachine.withgoogle.com/models/ZRCl0iJZF/';

// Classifier variables
var maleFemaleClassifier;
var glassesClassifier;
var ageClassifier;

// Classification thresholds
const thresholds = {
    couldBe: 0.0, // under 60%
    isLikely: 60, // 60% to 80%
    is: 80        // over 80%
};

function preload() {
    maleFemaleClassifier = ml5.imageClassifier(maleFemaleModelURL + 'model.json', modelLoaded);
    glassesClassifier = ml5.imageClassifier(glassesModelURL + 'model.json', modelLoaded);
    ageClassifier = ml5.imageClassifier(ageModelURL + 'model.json', modelLoaded);
}

function modelLoaded(error) {
    if (error) {
        console.error('Model loading error:', error);
        alert('Failed to load some models. Please reload the page.');
    } else {
        console.log('Model loaded successfully');
    }
}

function setup() {
    noCanvas(); // Since we are not using a video feed, no canvas is required.
}

function handleFile(input) {
    const file = input.files[0];
    if (file) {
        const imageContainer = document.getElementById('image_container');
        imageContainer.innerHTML = '';

        const img = new Image();
        img.onload = function() {
            imageContainer.appendChild(img);
            classifyImage(img);
        };
        img.onerror = function() {
            alert('Error loading image. Please choose another file.');
        };
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = '90%';
        img.style.height = 'auto';
    }
}

function classifyImage(img) {
    document.getElementById('results').innerText = "Classifying...";
    maleFemaleClassifier.classify(img, (error, results) => {
        if (error) {
            handleError('gender', error);
        } else {
            displayResult('gender', results);
        }
    });
    glassesClassifier.classify(img, (error, results) => {
        if (error) {
            handleError('glasses', error);
        } else {
            displayResult('glasses', results, true);
        }
    });
    ageClassifier.classify(img, (error, results) => {
        if (error) {
            handleError('age', error);
        } else {
            displayResult('age', results);
        }
    });
}

function displayResult(category, results, isGlasses = false) {
    if (results) {
        const result = results[0]; // Assuming results are sorted by confidence
        const confidence = (result.confidence * 100).toFixed(0);
        let interpretation = 'could be';
        if (confidence >= thresholds.is) interpretation = 'is';
        else if (confidence >= thresholds.isLikely) interpretation = 'is likely';

        let resultText = `Subject ${interpretation} ${result.label} (${confidence}%)`;
        if (isGlasses) {
            resultText = `Subject ${interpretation} wearing ${result.label} (${confidence}%)`;
        }
        document.getElementById('results').innerText += `${resultText}\n`;
    }
}

function handleError(category, error) {
    console.error(`${category} classification error:`, error);
    document.getElementById('results').innerText += `Error classifying ${category}. Please try again.\n`;
}

document.addEventListener('DOMContentLoaded', () => {
    preload();
});