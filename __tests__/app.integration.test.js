// import {screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import userEvent from '@testing-library/user-event';
// import { loadModel, handleFile, classifyImage } from '../index';
// import fs from 'fs';

// // Mocking the createObjectURL function to handle local file path
// const createObjectURLMock = jest.fn();
// global.URL.createObjectURL = createObjectURLMock;

// // Mocking the classifyImage function from index.js
// jest.mock('../index.js', () => ({
//     loadModel: jest.fn(),
//     handleFile: jest.fn(),
//     classifyImage: jest.fn(),
//     displayImage: jest.fn()
// }));

// // beforeAll(async () => {
// //     await loadModel('https://teachablemachine.withgoogle.com/models/IZ-QoH4aP/');
// // });
// beforeAll(async () => {
//     await loadModel.mockImplementation(() => Promise.resolve());
// });

// describe('Image Classifier Integration Tests', () => {
//     beforeEach(() => {
//         document.body.innerHTML = `
//             <header>
//                 <h1>Image Classifier</h1>
//             </header>
//             <main>
//                 <input type="file" id="file_input" aria-label="Upload an image for classification" onchange="handleFile(this)">
//                 <pre id="results" aria-live="polite" aria-label="Hazard detection identifier">Subject is a Car Hazard (95%)</pre>
//                 <div id="image_container" role="figure">
//                     <img src="blob:http://localhost:3000/3cf61f43-ab8e-4506-9cf9-c07b15850b77" style="max-width: 90%; height: auto;">
//                 </div>
//             </main>
//         `;
//     });

//     test('should load the model successfully', async () => {
//         const modelStatus = await loadModel('https://teachablemachine.withgoogle.com/models/IZ-QoH4aP/');
//         expect(modelStatus).toBeUndefined(); // No error thrown means the model is loaded
//     });

//     test('should handle image upload and display it', async () => {
//         const fileInput = screen.getByLabelText('Upload an image for classification');
//         const file = new File(['(testing)'], 'test.png', { type: 'image/png' });
        
//         // Mocking URL.createObjectURL
//         const createObjectURL = jest.fn().mockReturnValue("blob:http://localhost:3000/3cf61f43-ab8e-4506-9cf9-c07b15850b77");
//         global.URL.createObjectURL = createObjectURL;
        
//         userEvent.upload(fileInput, file);
        
//         // Check if the file is uploaded and displayed
//         const image = screen.getByRole('img');
//         expect(image).toBeInTheDocument();
//         expect(image.src).toBe("blob:http://localhost:3000/3cf61f43-ab8e-4506-9cf9-c07b15850b77");
//     });
//     test('should classify the uploaded image', async () => {
//         const fileInput = screen.getByLabelText('Upload an image for classification');
//         const file = new File([fs.readFileSync('/Users/khateebmotala/Documents/GitHub/safeDriveHUD/testImage1.png')], 'testImage1.png', { type: 'image/png' });
        
//         userEvent.upload(fileInput, file);

//         // Check if classification result is displayed
//         const results = await screen.findByLabelText("Hazard detection identifier");
//         expect(results).toBeInTheDocument();
//         expect(results).toHaveTextContent('Subject');
//     });

//     test('should display an error for non-image file upload', async () => {
//         const fileInput = screen.getByLabelText('Upload an image for classification');
//         const nonImageFile = new File([fs.readFileSync('/Users/khateebmotala/Documents/GitHub/safeDriveHUD/README.md')] , 'README.md');
        
        
//         // Mocking the error display function
//         window.alert = jest.fn();
        
//         userEvent.upload(fileInput, nonImageFile);
        
//         // Check if the alert was called with the correct message
//         expect(window.alert).toHaveBeenCalledWith('Error loading Image. Please choose another file.');
//     });
// });

/////////
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { loadModel, handleFile, classifyImage } from '../index';
import fs from 'fs';

// Mocking the createObjectURL function to handle local file path
const createObjectURLMock = jest.fn();
global.URL.createObjectURL = createObjectURLMock;

// Mocking the classifyImage function and other functions from index.js
jest.mock('../index.js', () => ({
    loadModel: jest.fn(),
    handleFile: jest.fn(),
    classifyImage: jest.fn(),
    displayImage: jest.fn()
}));

// Mocking the hazardClassifier
const hazardClassifier = {
    classify: jest.fn()
};

beforeAll(async () => {
    await loadModel.mockImplementation(() => Promise.resolve());
});

describe('Image Classifier Integration Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <header>
                <h1>Image Classifier</h1>
            </header>
            <main>
                <input type="file" id="file_input" aria-label="Upload an image for classification" onchange="handleFile(this)">
                <pre id="results" aria-live="polite" aria-label="Hazard detection identifier">Subject is a Car Hazard (95%)</pre>
                <div id="image_container" role="figure">
                    <img src="blob:http://localhost:3000/3cf61f43-ab8e-4506-9cf9-c07b15850b77" style="max-width: 90%; height: auto;">
                </div>
            </main>
        `;
    });

    test('should load the model successfully', async () => {
        const modelStatus = await loadModel('https://teachablemachine.withgoogle.com/models/IZ-QoH4aP/');
        expect(modelStatus).toBeUndefined(); // No error thrown means the model is loaded
    });

    test('should handle image upload and display it', async () => {
        const fileInput = screen.getByLabelText('Upload an image for classification');
        const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
        
        // Mocking URL.createObjectURL
        createObjectURLMock.mockReturnValueOnce("blob:http://localhost:3000/3cf61f43-ab8e-4506-9cf9-c07b15850b77");
        
        userEvent.upload(fileInput, file);
        
        // Check if the file is uploaded and displayed
        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
        expect(image.src).toBe("blob:http://localhost:3000/3cf61f43-ab8e-4506-9cf9-c07b15850b77");
    });

    test('should classify the uploaded image', async () => {
        const fileInput = screen.getByLabelText('Upload an image for classification');
        const file = new File([fs.readFileSync('/Users/khateebmotala/Documents/GitHub/safeDriveHUD/testImage1.png')], 'testImage1.png', { type: 'image/png' });
        
        userEvent.upload(fileInput, file);

        // Mocking the classification result
        const mockResult = [{ label: 'Car Hazard', confidence: 0.95 }];
        hazardClassifier.classify.mockResolvedValueOnce(mockResult);
        
        // Check if classification result is displayed
        const results = await screen.findByLabelText("Hazard detection identifier");
        expect(results).toBeInTheDocument();
        expect(results).toHaveTextContent('Subject');
    });

    test('should display an error for non-image file upload', async () => {
        const fileInput = screen.getByLabelText('Upload an image for classification');
        const nonImageFile = new File(['This is not an image'], 'test.txt', { type: 'text/plain' });
        
        // // Mocking the alert function
        // window.alert = jest.fn();
        
        userEvent.upload(fileInput, nonImageFile);
        
        // // Check if the alert was called with the correct message
        // expect(window.alert).toHaveBeenCalledWith('Error loading Image. Please choose another file.');
        const results = await screen.findByLabelText("Hazard detection identifier");
        expect(results).toBeInTheDocument();
        expect(results).toHaveTextContent('Error classifying hazard. Please try again.');
    });

    test('should handle errors during image classification', async () => {
        const fileInput = screen.getByLabelText('Upload an image for classification');
        // const file = new File([fs.readFileSync('/Users/khateebmotala/Documents/GitHub/safeDriveHUD/testImage1.png')], 'testImage1.png', { type: 'image/png' });
        const file = new File([fs.readFileSync('/Users/khateebmotala/Documents/GitHub/safeDriveHUD/README.md')] , 'README.md');

        userEvent.upload(fileInput, file);

        // Mocking an error during classification
        // hazardClassifier.classify.mockRejectedValueOnce(new Error('Classification error'));

        // Simulate classification function call
        await classifyImage(file);

        // Check if the error handling function was called correctly
        const results = await screen.findByLabelText("Hazard detection identifier");
        expect(results).toBeInTheDocument();
        expect(results).toHaveTextContent('Error classifying hazard. Please try again.');
    });
});
