# Member Names
- Gustavo Necochea
- Alfred Chen

# Problem Statement
- The problem we are trying to solve is to use Naive Bayes Prediction to predict a feature out of seven features we track for approximately 400 civilizations.

# Approach and Description of the Software
## Power Query in Excel to Transform the Table
![image](https://github.com/user-attachments/assets/bf585fc0-45f0-4f22-9703-4ad1ad7a6cdc)
## Converting to JSON
![image](https://github.com/user-attachments/assets/d742b1dd-8622-4ccd-8053-64e0a9d7a0f4)
## Creating a Naive Bayes Algorithm Pipeline
![image](https://github.com/user-attachments/assets/48497701-eb53-4b39-ac9e-7e07c5087e5d)
### Prior probabilities: just data and target column
![image](https://github.com/user-attachments/assets/ad3f44c4-cb7c-4e25-804f-a1d53633383b)
### Conditional probabilities: user input comes into play along with data and the target column
![image](https://github.com/user-attachments/assets/0c5836c5-5f5a-4522-8d66-12c62cabb283)
### Joint Probabilities: multipliying the conditional and prior probabilities given a single target value
![image](https://github.com/user-attachments/assets/9f4f20ac-c0eb-45bc-ba4a-0839ab5eb894)
### Normalize the Joint Probabilities into Percentages (they are ratios)
![image](https://github.com/user-attachments/assets/f82c53a4-870d-4db6-9cb8-546f8beeb5e1)
## Creating an Expo Project for the frontend
### Returning the Results
![image](https://github.com/user-attachments/assets/8f7622bb-6301-4858-a58e-afd08f62ce64)
### Frontend
![image](https://github.com/user-attachments/assets/7cfb5b06-97cb-4a38-97f9-179059647fa0)


# Evaluation
- Fairly simple: We tried the script against Homework 9 Question 2

# Conclusion and Future Work
- Choosing features is very difficult, as is transforming data
  - Some features we wished to include were unfeasible
- The frontend portion took the least amount of time

# References
- Data retrieved from Seshat: Global History Databank. Available at: http://seshatdatabank.info/
- CPSC481_Lecture_20_S25 for reviewing the topic
- Homework 9 Question 2 for testing
