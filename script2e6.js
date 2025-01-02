const fs = require('fs');

// Convert a value from a specific base to base-10
function convertToDecimal(base, value) {
    return parseInt(value, base);
}

// Compute the average of an array of numbers
function computeAverage(numbers) {
    const total = numbers.reduce((sum, number) => sum + number, 0);
    return total / numbers.length;
}

// Calculate the standard deviation of an array using a precomputed average
function computeStandardDeviation(numbers, average) {
    const variance = numbers.reduce((sum, number) => sum + Math.pow(number - average, 2), 0) / numbers.length;
    return Math.sqrt(variance);
}

// Identify outliers in a dataset based on a standard deviation threshold
function identifyOutliers(dataPoints) {
    const yValues = dataPoints.map(point => point.y); // Extract y-coordinates

    const average = computeAverage(yValues); // Calculate the average
    const standardDeviation = computeStandardDeviation(yValues, average); // Calculate standard deviation

    const deviationLimit = 2; // Threshold: 2 standard deviations from the mean

    // Find points where y-value deviates significantly from the average
    return dataPoints.filter(point => Math.abs(point.y - average) > deviationLimit * standardDeviation);
}

// Process a JSON file to extract data points and detect outliers
function analyzeOutliersFromFile(filePath) {
    fs.readFile(filePath, 'utf8', (error, fileContent) => {
        if (error) {
            console.error("Error reading the file:", error);
            return;
        }

        const parsedData = JSON.parse(fileContent); // Parse JSON data
        const points = [];

        // Process each entry to construct data points
        for (const key in parsedData) {
            if (key !== 'keys') {
                const base = parseInt(parsedData[key].base, 10);
                const value = parsedData[key].value;
                const x = parseInt(key, 10); // Use the key as the x-coordinate
                const y = convertToDecimal(base, value); // Decode y-coordinate

                points.push({ x, y });
            }
        }

        // Identify outliers in the extracted points
        const outliers = identifyOutliers(points);

        console.log("Detected outliers:", outliers); // Log the detected outliers
    });
}

// Analyze the given JSON file for outliers
analyzeOutliersFromFile('testcase2.json');

