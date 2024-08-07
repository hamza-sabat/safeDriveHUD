'use strict';

// Global variable for classifier URL
var hazardModelURL = 'https://teachablemachine.withgoogle.com/models/IZ-QoH4aP/';

// Classifier variable
var hazardClassifier;

// Classification thresholds
const thresholds = {
    couldBe: 0.0, // under 60%
    isLikely: 60, // 60% to 80%
    is: 80        // over 80%
};

function preload() {
    hazardClassifier = ml5.imageClassifier(hazardModelURL + 'model.json', modelLoaded);
}

function modelLoaded(error) {
    if (error) {
        console.error('Model loading error:', error);
        alert('Failed to load the model. Please reload the page.');
    } else {
        console.log('Model loaded successfully');
    }
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
    hazardClassifier.classify(img, (error, results) => {
        if (error) {
            handleError('hazard', error);
        } else {
            displayResult('hazard', results);
        }
    });
}

function displayResult(category, results) {
    if (results) {
        const result = results[0]; // Assuming results are sorted by confidence
        const confidence = (result.confidence * 100).toFixed(0);
        let interpretation = 'could be';
        if (confidence >= thresholds.is) interpretation = 'is';
        else if (confidence >= thresholds.isLikely) interpretation = 'is likely';

        let resultText = `Subject ${interpretation} a ${result.label} hazard (${confidence}%)`;
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