const {
    detectTargetColumn,
    calculatePriors,
    calculateLikelihoods,
    calculateJointProbabilities,
    calculatePosteriors
  } = require('./NaiveBayes.js');
  const data = require('./final-database.json');
  
  function splitData(data, testSize = 0.2) {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    const testCount = Math.floor(data.length * testSize);
    const testSet = shuffled.slice(0, testCount);
    const trainingSet = shuffled.slice(testCount);
    return { trainingSet, testSet };
  }
  
  function testDurationAccuracy(trainingData, testData) {
    let correctPredictions = 0;
    const targetCol = "Duration"; // 👈 Only test "Duration"
    
    console.log(`\nTesting ONLY: "${targetCol}"`);
  
    for (const testRow of testData) {
      const userInput = {...testRow};
      delete userInput[targetCol]; // Remove "Duration" to simulate prediction
      delete userInput["Polity"];  // Remove non-feature column
      delete userInput["Military"];  // Remove non-feature column
      delete userInput["Religious"];  // Remove non-feature column
      delete userInput["Admin"];  // Remove non-feature column

      
      try {
        const priors = calculatePriors(trainingData, targetCol);
        const likelihoods = calculateLikelihoods(trainingData, targetCol, userInput);
        const jointProbs = calculateJointProbabilities(priors, likelihoods, targetCol);
        const predicted = calculatePosteriors(jointProbs, targetCol);
        
        // Check if prediction matches actual value
        if (String(predicted).toLowerCase() === String(testRow[targetCol]).toLowerCase()) {
          correctPredictions++;
        }
      } catch (e) {
        console.log(`Skipping row due to error: ${e.message}`);
        continue;
      }
    }
    
    const totalTests = testData.length;
    const accuracy = (correctPredictions / totalTests) * 100;
    
    return {
      totalTests,
      correctPredictions,
      accuracy,
      testedFeature: targetCol
    };
  }
  
  function runAccuracyTest() {
    const { trainingSet, testSet } = splitData(data);
    console.log(`\nTotal data: ${data.length}`);
    console.log(`Training set: ${trainingSet.length} (${Math.round(trainingSet.length/data.length*100)}%)`);
    console.log(`Test set: ${testSet.length} (${Math.round(testSet.length/data.length*100)}%)`);
    
    const { 
      totalTests, 
      correctPredictions, 
      accuracy,
      testedFeature 
    } = testDurationAccuracy(trainingSet, testSet);
    
    console.log('\n=== Accuracy Results for "Duration" ===');
    console.log(`Total tests run: ${totalTests}`);
    console.log(`Correct predictions: ${correctPredictions}`);
    console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
  }
  
  runAccuracyTest();