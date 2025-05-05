import { StyleSheet, TextInput, Button, View } from "react-native";
import { useState } from "react";
import data from "@/assets/database/filtered_output.json";

import {
  detectTargetColumn,
  calculatePriors,
  calculateLikelihoods,
  calculateJointProbabilities,
  calculatePosteriors,
} from "../NaiveBayes";

import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  const [inputs, setInputs] = useState({
    "Hierarchical Complexity:Settlement hierarchy": "4",
    "Hierarchical Complexity:Administrative levels": "5",
    "Hierarchical Complexity:Religious levels": "3",
    "Hierarchical Complexity:Military levels": "6",
  });

  const [prediction, setPrediction] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handlePredict = () => {
    try {
      const filledValues = Object.values(inputs).filter((v) => v.trim() !== "");
      if (filledValues.length !== 4) {
        setPrediction("Please fill in all fields.");
        return;
      }

      const userInput = { ...inputs };

      const targetCol = detectTargetColumn(data, userInput);

      const priors = calculatePriors(data, targetCol);
      const likelihoods = calculateLikelihoods(data, targetCol, userInput);
      const jointProbs = calculateJointProbabilities(
        priors,
        likelihoods,
        userInput,
        targetCol
      );
      const predicted = calculatePosteriors(jointProbs, targetCol, userInput);

      setPrediction(predicted);
    } catch (error) {
      console.error("Naive Bayes error:", error);
      setPrediction("Error in prediction.");
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.resultTitle}>
        Naive Bayes NGA Predictor
      </ThemedText>

      {Object.keys(inputs).map((key) => (
        <TextInput
          key={key}
          placeholder={key}
          value={inputs[key as keyof typeof inputs]}
          onChangeText={(value) => handleChange(key, value)}
          style={styles.input}
        />
      ))}

      <Button title="Predict NGA" onPress={handlePredict} />

      <View style={styles.result}>
        <ThemedText type="subtitle" style={styles.resultTitle}>
          Predicted NGA:
        </ThemedText>
        <ThemedText style={styles.resultTitle}>
          {prediction || "Awaiting input..."}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  input: {
    color: "#000",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  result: {
    color: "#000",
    marginTop: 24,
    alignItems: "center",
  },
  resultTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    color: "#000",
    fontSize: 16,
  },
});
