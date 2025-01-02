const fs = require('fs');

// Function to convert a number from a specified base to base-10
function convertBaseToDecimal(base, value) {
    return parseInt(value, base);
}

// Function to perform Lagrange interpolation and compute the constant term
function lagrangeInterpolation(dataPoints, subsetSize) {
    let constant = 0;

    for (let i = 0; i < subsetSize; i++) {
        let xi = dataPoints[i].x;
        let yi = dataPoints[i].y;
        let basisPolynomial = 1;

        // Calculate the Lagrange basis polynomial
        for (let j = 0; j < subsetSize; j++) {
            if (i !== j) {
                let xj = dataPoints[j].x;
                basisPolynomial *= -xj / (xi - xj);
            }
        }

        constant += yi * basisPolynomial;
    }

    return constant;
}

// Function to extract the constant term using the given JSON data
function calculateConstantFromJson(inputData) {
    const totalPoints = inputData.keys.n;
    const subsetSize = inputData.keys.k;

    const dataPoints = [];

    // Parse the points from the input JSON
    for (const key in inputData) {
        if (key !== 'keys') {
            const base = parseInt(inputData[key].base, 10);
            const value = inputData[key].value;
            const x = parseInt(key, 10); // Use the key as the x-coordinate
            const y = convertBaseToDecimal(base, value); // Convert value to decimal
            dataPoints.push({ x, y });
        }
    }

    // Ensure the points are sorted by x-coordinate
    dataPoints.sort((a, b) => a.x - b.x);

    return lagrangeInterpolation(dataPoints, subsetSize);
}

// Function to process multiple test cases and log their results
function processTestCases(testCaseData) {
    testCaseData.forEach((testCase, index) => {
        const constant = calculateConstantFromJson(testCase);
        console.log(`The constant term for test case ${index + 1} is: ${constant}`);
    });
}

// Read the test case files and process them
const testCase1 = JSON.parse(fs.readFileSync('testcase1.json', 'utf8'));
const testCase2 = JSON.parse(fs.readFileSync('testcase2.json', 'utf8'));

const testCases = [testCase1, testCase2];

// Execute the test case processing
processTestCases(testCases);

