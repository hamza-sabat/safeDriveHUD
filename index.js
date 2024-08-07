'use strict';

var hazardModelURL = 'https://teachablemachine.withgoogle.com/models/IZ-QoH4aP/';
var hazardClassifier;

const thresholds = {
    couldBe: 0.0,
    isLikely: 60,
    is: 80
};

async function preload() {
    try {
        hazardClassifier = await ml5.imageClassifier(hazardModelURL + 'model.json');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Model loading error:', error);
        alert('Failed to load the model. Please reload the page.');
    }
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
            document.getElementById('overlay').style.display = 'block';
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
            document.getElementById('results').innerText = ""; // Clear the "Classifying..." text
            displayResult('hazard', results);
        }
    });
}

function displayResult(category, results) {
    if (results) {
        const result = results[0];
        const confidence = (result.confidence * 100).toFixed(0);
        let interpretation = 'could be';
        if (confidence >= thresholds.is) interpretation = 'is';
        else if (confidence >= thresholds.isLikely) interpretation = 'is likely';

        let resultText = `Subject ${interpretation} a ${result.label} (${confidence}%)`;
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