// __mocks__/ml5.js
module.exports = {
    imageClassifier: jest.fn().mockResolvedValue({
        classify: jest.fn().mockResolvedValue([{ label: 'test', confidence: 0.95 }])
    })
};
