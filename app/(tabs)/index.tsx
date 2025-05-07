import { StyleSheet, Text, Button, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import data from "@/assets/database/final-database.json";

import {
  detectTargetColumn,
  calculatePriors,
  calculateLikelihoods,
  calculateJointProbabilities,
  calculatePosteriors,
} from "../NaiveBayes";

import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  const feature_dict = {
    "Time Period": "The time period during which the civilization existed.",
    Duration: "The length of time the civilization lasted",
    NGA: "(Natural Geographic Area): Its rough spatial scale is 100 km × 100 km (+/- 50%). Examples: Latium, Upper Egypt, Middle Yellow River Valley.",
    Settlement:
      "The level of settlement density (low, mid: Akkadian Empire, high: Ming Dynasty): '(1) Large City (monumental structures, theatre, market, hospital, central government buildings) (2) City (market, theatre, regional government buildings) (3) Large Town (market, administrative buildings) ...'",
    Admin:
      "Administrative Level (low, mid: Macedonian Empire, high: Russian Empire Romanov Dynasty II): 'Administrative levels records the administrative levels of a polity... (1) the overall ruler, (2) provincial/regional governors, (3) district heads, ...'",
    Religious:
      "Religiosity Level (low, mid: Napoleonic France, high: Roman Empire Late Antiquity): 'Start with the head of the official cult (if present) coded as: level 1, and work down to the local priest.  '",
    Military:
      "Military Level (low, mid: Ptolemaic Kingdom II, high: Republic of Venice III): 'Start with the commander-in-chief coded as: level 1, and work down to the private.'",
  };

  const options = {
    "Time Period": [
      "",
      "modern",
      "postclassic",
      "ancient",
      "early_modern",
      "prehistoric",
    ],
    Duration: ["", "decades", "half_a_millennium", "century", "millennia"],
    NGA: [
      "",
      "Kachi Plain",
      "Sogdiana",
      "Ghanaian",
      "Garo Hills",
      "Kapuas Basin",
      "Middle Yellow River Valley",
      "Southern China Hills",
      "Orkhon Valley",
      "North Colombia",
      "Lowland Andes",
      "Upper Egypt",
      "Cuzco",
      "Chuuk Islands",
      "Paris Basin",
      "Cahokia",
      "Konya Plain",
      "Susiana",
      "Big Island Hawaii",
      "Iceland",
      "Central Java",
      "Deccan",
      "Finger Lakes",
      "Latium",
      "Kansai",
      "Cambodian Basin",
      "Niger Inland Delta",
      "Yemeni Coastal Plain",
      "Valley of Oaxaca",
      "Oro PNG",
      "Lena River Valley",
    ],
    Settlement: ["", "low", "mid", "high"],
    Admin: ["", "low", "mid", "high"],
    Religious: ["", "low", "mid", "high"],
    Military: ["", "low", "mid", "high"],
  };
  const [inputs, setInputs] = useState({
    "Time Period": "",
    Duration: "",
    NGA: "",
    Settlement: "",
    Admin: "",
    Religious: "",
    Military: "",
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [targetColumn, setTargetColumn] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handlePredict = () => {
    try {
      // Find which field(s) are empty
      const emptyFields = Object.keys(inputs).filter(
        (key) => inputs[key as keyof typeof inputs].trim() === ""
      );

      if (emptyFields.length !== 1) {
        setPrediction("Please leave exactly one of the seven fields empty.");
        return;
      }

      // Create a copy excluding the empty field
      const userInput = { ...inputs };
      const missingField = emptyFields[0];
      delete userInput[missingField as keyof typeof inputs];

      const targetCol = detectTargetColumn(data, userInput);
      setTargetColumn(targetCol);

      const priors = calculatePriors(data, targetCol);
      const likelihoods = calculateLikelihoods(data, targetCol, userInput);
      const jointProbs = calculateJointProbabilities(
        priors,
        likelihoods,
        userInput
      );
      const predicted = calculatePosteriors(jointProbs, targetCol);

      setPrediction(predicted);
    } catch (error) {
      console.error("Naive Bayes error:", error);
      setPrediction("Error in prediction.");
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.resultTitle}>
        Naive Bayes Civilization Predictor
      </ThemedText>

      {Object.keys(inputs).map((key) => (
        <View key={key} style={{ marginBottom: 12 }}>
          <Text style={styles.resultText}>{key}</Text>
          <Text style={styles.desciptionText}>
            {feature_dict[key as keyof typeof feature_dict]}
          </Text>
          <Picker
            selectedValue={inputs[key as keyof typeof inputs]}
            onValueChange={(value) => handleChange(key, value)}
            style={styles.picker}
          >
            {options[key as keyof typeof options].map((option) => (
              <Picker.Item
                key={option}
                label={option || "(leave blank)"}
                value={option}
              />
            ))}
          </Picker>
        </View>
      ))}

      <Button title="Predict Civilization" onPress={handlePredict} />

      <View style={styles.result}>
        <ThemedText type="subtitle" style={styles.resultTitle}>
          Predicted {targetColumn || "target column"}:
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
  picker: {
    color: "#000",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
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
    fontWeight: "bold",
  },
  desciptionText: {
    color: "#000",
    fontSize: 12,
  },
});
