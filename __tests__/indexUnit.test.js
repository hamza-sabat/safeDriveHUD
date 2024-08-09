const { loadModel, handleFile, displayImage, classifyImage, displayResult, getInterpretation, handleError } = require('../public/index.js');
jest.mock('ml5');

// Mocking URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');

describe('Testing index.js functions', () => {
    let mockFileInput, mockImage, mockResultElement, mockImageContainer;

    beforeEach(() => {
        mockFileInput = { files: [new Blob()] };
        mockImage = new Image();
        mockResultElement = document.createElement('pre');
        mockImageContainer = document.createElement('div');

        document.getElementById = jest.fn((id) => {
            if (id === 'results') return mockResultElement;
            if (id === 'image_container') return mockImageContainer;
        });

        console.log = jest.fn();
        console.error = jest.fn();
    });
    test('Model should load without errors', async () => {
      await expect(loadModel('https://teachablemachine.withgoogle.com/models/IZ-QoH4aP/')).resolves.not.toThrow();
  });

    test('handleFile should call displayImage with the selected file', () => {
        const displayImageSpy = jest.spyOn(require('../public/index.js'), 'displayImage'); // Spy on displayImage
        handleFile(mockFileInput);
        expect(displayImageSpy).toHaveBeenCalledWith(mockFileInput.files[0]);
        displayImageSpy.mockRestore(); // Restore the original implementation
    });

    test('displayImage should load and classify image', () => {
        const classifyImageSpy = jest.spyOn(require('../public/index.js'), 'classifyImage'); // Spy on classifyImage
        displayImage(new Blob());
        mockImage.onload();
        expect(mockImageContainer.appendChild).toHaveBeenCalledWith(mockImage);
        expect(classifyImageSpy).toHaveBeenCalledWith(mockImage);
        classifyImageSpy.mockRestore(); // Restore the original implementation
    });

    test('classifyImage should classify image and display result', async () => {
        const displayResultSpy = jest.spyOn(require('../public/index.js'), 'displayResult'); // Spy on displayResult
        
        // Simulate the classifier behavior
        ml5.imageClassifier.mockResolvedValueOnce({
            classify: jest.fn().mockResolvedValue([{ label: 'test', confidence: 0.95 }])
        });

        // Call classifyImage
        await classifyImage(mockImage);

        // Assertions
        expect(mockResultElement.innerText).toBe('Classifying...');
        expect(displayResultSpy).toHaveBeenCalledWith([{ label: 'test', confidence: 0.95 }]);
        
        displayResultSpy.mockRestore(); // Restore the original implementation
    });

    test('displayResult should show the correct result text', () => {
        displayResult([{ label: 'test', confidence: 0.95 }]);
        expect(mockResultElement.innerText).toBe('Subject is a test (95%)');
    });

    test('getInterpretation should return correct interpretations', () => {
        expect(getInterpretation(85)).toBe('is');
        expect(getInterpretation(65)).toBe('is likely');
        expect(getInterpretation(55)).toBe('could be');
    });

    test('handleError should display an error message', () => {
        handleError('hazard', new Error('Test error'));
        expect(mockResultElement.innerText).toBe('Error classifying hazard. Please try again.');
        expect(console.error).toHaveBeenCalledWith('hazard classification error:', expect.any(Error));
    });
});



