// import data from "@/assets/database/final-database.json";

// const userInput = {
//   "Time Period": "modern",
//   Duration: "decades",
//   NGA: "Kachi Plain",
//   Settlement: "mid",
//   Admin: "mid",
//   Religious: "low",
// };

// -----------------------------
// 1️⃣ Detect target column
// -----------------------------

function detectTargetColumn(data, userInput) {
  const allFeatures = new Set(
    Object.keys(data[0]).filter((key) => key !== "Polity")
  );
  const userProvided = new Set(Object.keys(userInput));
  const missing = [...allFeatures].filter((x) => !userProvided.has(x));
  if (missing.length !== 1) {
    throw new Error("Exactly one feature must be missing in user input.");
  }
  return missing[0];
}

// -----------------------------
// 2️⃣ Calculate priors
// -----------------------------

function calculatePriors(data, targetCol) {
  const total = data.length;
  const priors = {};

  console.log("=== Prior Probabilities ===");
  const counts = {};
  data.forEach((row) => {
    const value = row[targetCol];
    counts[value] = (counts[value] || 0) + 1;
  });

  Object.entries(counts).forEach(([outcome, count]) => {
    priors[outcome] = count / total;
    console.log(
      `P(${targetCol}=${outcome}) = ${count}/${total} = ${priors[
        outcome
      ].toFixed(2)}`
    );
  });

  console.log();
  return priors;
}

// -----------------------------
// 3️⃣ Calculate conditional probabilities
// -----------------------------

function calculateLikelihoods(data, targetCol, userInput) {
  console.log("=== Conditional Probabilities ===");
  const outcomes = [...new Set(data.map((row) => row[targetCol]))];
  const likelihoods = {};

  outcomes.forEach((outcome) => {
    likelihoods[outcome] = {};
    const subset = data.filter((row) => row[targetCol] === outcome);

    Object.entries(userInput).forEach(([feature, value]) => {
      const countMatch = subset.filter(
        (row) =>
          String(row[feature] || "").toLowerCase() ===
          String(value).toLowerCase()
      ).length;
      const prob = subset.length > 0 ? countMatch / subset.length : 0;
      likelihoods[outcome][feature] = prob;

      console.log(
        `P(${feature}=${value}|${targetCol}=${outcome}) = ${countMatch}/${
          subset.length
        } = ${prob.toFixed(3)}`
      );
    });
  });

  console.log();
  return likelihoods;
}

// -----------------------------
// 4️⃣ Calculate joint probabilities
// -----------------------------

function calculateJointProbabilities(priors, likelihoods, targetCol) {
  console.log("=== Joint Probabilities (before normalization) ===");
  const jointProbs = {};

  Object.entries(priors).forEach(([outcome, prior]) => {
    const product = Object.values(likelihoods[outcome]).reduce(
      (acc, val) => acc * val,
      1
    );
    const joint = prior * product;
    jointProbs[outcome] = joint;

    const likelihoodsStr = Object.values(likelihoods[outcome])
      .map((val) => val.toFixed(3))
      .join(" * ");

    console.log(
      `P(${targetCol}=${outcome}, features) = ${prior.toFixed(
        4
      )} * (${likelihoodsStr}) = ${joint.toFixed(5)}`
    );
  });

  console.log();
  return jointProbs;
}

// -----------------------------
// 5️⃣ Calculate posteriors
// -----------------------------

function calculatePosteriors(jointProbs, targetCol) {
  const totalJoint = Object.values(jointProbs).reduce(
    (acc, val) => acc + val,
    0
  );
  const posteriorProbs = {};

  console.log("=== Posterior Probabilities (after normalization) ===");

  Object.entries(jointProbs).forEach(([outcome, joint]) => {
    const posterior = totalJoint > 0 ? joint / totalJoint : 0;
    posteriorProbs[outcome] = posterior;
    console.log(
      `P(${targetCol}=${outcome} | features) = ${posterior.toFixed(3)}`
    );
  });

  const predicted = Object.entries(posteriorProbs).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];
  console.log(`\n✅ Prediction: ${targetCol} = ${predicted}\n`);

  return predicted;
}

// // -----------------------------
// // 6️⃣ Run the pipeline
// // -----------------------------

// const targetCol = detectTargetColumn(data, userInput);
// console.log(`🔍 Missing feature detected: ${targetCol} → Will predict this.\n`);

// const priors = calculatePriors(data, targetCol);
// const likelihoods = calculateLikelihoods(data, targetCol, userInput);
// const jointProbs = calculateJointProbabilities(priors, likelihoods, targetCol);
// const predicted = calculatePosteriors(jointProbs, targetCol);

// console.log("=== Final Prediction ===");
// console.log(`Predicted ${targetCol} = ${predicted}`);

export {
  detectTargetColumn,
  calculatePriors,
  calculateLikelihoods,
  calculateJointProbabilities,
  calculatePosteriors,
};