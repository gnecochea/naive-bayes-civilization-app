const {
    calculatePriors,
    calculateLikelihoods,
    calculateJointProbabilities,
    calculatePosteriors
  } = require('./NaiveBayes.js');
  const data = require('./final-database.json');
  
  // 1. Split data into training (80%) and test (20%)
  function splitData(data, testSize = 0.2) {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    const testCount = Math.floor(data.length * testSize);
    return {
      trainingSet: shuffled.slice(testCount),
      testSet: shuffled.slice(0, testCount)
    };
  }
  
  // 2. Test accuracy when excluding one feature at a time
  function testFeatureImpact(trainingData, testData, targetCol = "Duration") {
    const allFeatures = Object.keys(testData[0])
      .filter(key => key !== "Polity" && key !== targetCol);
  
    const results = {};
  
    for (const excludedFeature of allFeatures) {
      let correctPredictions = 0;
      const testedFeatures = allFeatures.filter(f => f !== excludedFeature);
  
      for (const testRow of testData) {
        const userInput = {};
        // Only include features NOT excluded
        testedFeatures.forEach(f => userInput[f] = testRow[f]);
  
        try {
          const priors = calculatePriors(trainingData, targetCol);
          const likelihoods = calculateLikelihoods(trainingData, targetCol, userInput);
          const jointProbs = calculateJointProbabilities(priors, likelihoods, targetCol);
          const predicted = calculatePosteriors(jointProbs, targetCol);
  
          if (String(predicted).toLowerCase() === String(testRow[targetCol]).toLowerCase()) {
            correctPredictions++;
          }
        } catch (e) {
          continue; // Skip rows with missing data
        }
      }
  
      const accuracy = (correctPredictions / testData.length) * 100;
      results[excludedFeature] = {
        accuracy,
        featuresUsed: testedFeatures
      };
    }
  
    return results;
  }
  
  // 3. Main execution
  function runAnalysis() {
    const { trainingSet, testSet } = splitData(data);
    console.log(`Training set: ${trainingSet.length} rows | Test set: ${testSet.length} rows`);
  
    const impactResults = testFeatureImpact(trainingSet, testSet);
  
    // Sort features by accuracy (descending)
    const sortedResults = Object.entries(impactResults)
      .sort(([, a], [, b]) => b.accuracy - a.accuracy);
  
    console.log("\n=== Feature Impact on Predicting 'Duration' ===");
    console.log("(Higher accuracy = better prediction when this feature is REMOVED)");
    console.log("-----------------------------------------------");
    sortedResults.forEach(([feature, stats]) => {
      console.log(
        `Exclude "${feature}": ${stats.accuracy.toFixed(2)}% accuracy | ` +
        `Used features: ${stats.featuresUsed.join(', ')}`
      );
    });
  
    // Best scenario (highest accuracy)
    const [bestFeature, bestStats] = sortedResults[0];
    console.log("\n⭐ Best Prediction When Excluding:");
    console.log(`-> "${bestFeature}" (Accuracy: ${bestStats.accuracy.toFixed(2)}%)`);
    console.log(`-> Features used: ${bestStats.featuresUsed.join(', ')}`);
  }
  
  runAnalysis();