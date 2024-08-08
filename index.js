'use strict';

const hazardModelURL = 'https://teachablemachine.withgoogle.com/models/IZ-QoH4aP/';
let hazardClassifier;

document.addEventListener('DOMContentLoaded', () => {
    loadModel(hazardModelURL);
});

async function loadModel(url) {
    try {
        hazardClassifier = await ml5.imageClassifier(`${url}model.json`);
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Model loading error:', error);
        alert('Failed to load the model. Please reload the page.');
    }
}

function handleFile(input) {
    const file = input.files[0];
    if (file && file.type.startsWith('image/')) {
        displayImage(file);
    } else {
        alert('Error loading Image. Please choose another file.');
    }
}

function displayImage(file) {
    const imageContainer = document.getElementById('image_container');
    imageContainer.innerHTML = '';

    const img = new Image();
    img.onload = () => {
        imageContainer.appendChild(img);
        classifyImage(img);
    };
    img.onerror = () => {
        alert('Error loading Image. Please choose another file.');
    };
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '90%';
    img.style.height = 'auto';
}

async function classifyImage(img) {
    try {
        document.getElementById('results').innerText = "Classifying...";
        const results = await hazardClassifier.classify(img);
        displayResult(results);
    } catch (error) {
        handleError('hazard', error);
    }
}

function displayResult(results) {
    const result = results[0];
    const confidence = (result.confidence * 100).toFixed(0);
    const interpretation = getInterpretation(confidence);
    const resultText = `Subject ${interpretation} a ${result.label} (${confidence}%)`;
    document.getElementById('results').innerText = resultText;
}

function getInterpretation(confidence) {
    if (confidence >= 80) return 'is';
    if (confidence >= 60) return 'is likely';
    return 'could be';
}

function handleError(category, error) {
    console.error(`${category} classification error:`, error);
    document.getElementById('results').innerText = `Error classifying ${category}. Please try again.`;
}

module.exports = {
    loadModel,
    handleFile,
    displayImage,
    classifyImage,
    displayResult,
    getInterpretation,
    handleError
};