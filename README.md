# Member Names
- Gustavo Necochea
- Alfred Chen

# Important Files
- README.md
- Evaluation folder
![image](https://github.com/user-attachments/assets/0300544a-359b-42fd-a655-aebb0dcae811)
- NaiveBayes\app\(tabs)\index.tsx
- NaiveBayes\app\NaiveBayes.js
- NaiveBayes\assets\database\final-database.json

# Problem Statement
- The problem we are trying to solve is to use Naive Bayes Prediction to predict any feature out of seven features we track for approximately 400 civilizations.

# Approach and Description of the Software
## Polities
### Comparison of Example to Civilization Dataset
![image](https://github.com/user-attachments/assets/94154af2-1bde-4ee7-b8be-ffcc2c7d925b)
![image](https://github.com/user-attachments/assets/9659788e-d40d-482f-9707-958f756513c8)
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
![image](https://github.com/user-attachments/assets/5c153cac-f360-49b2-a464-d8f81b162174)


# Evaluation
- We added an evaluation function that takes out one feature at a time
- We end up with an average of ~35-45% when we take out a feature, which is better than chance: 20%
  - It seems that a lot of the features ARE dependent, as taking out one or another give similar precisions
  - Ultimately, more than one feature at a time would need to be taken out to determine which are redundant
![image](https://github.com/user-attachments/assets/e82e5988-37a3-46dd-9127-37fd6017393a)

# Conclusion and Future Work
- Now we have a Naive Bayes Pipeline and Evaluator we can use in future work
- The frontend can be improved as well
- The coding part is very boiler-plate, hence the significant amount of LLM-derived code
  - There were dozens of tweaks, but even those tweaks were usually subsequently refactored for the sake of clarity
  - A lot more time was spent on PowerQuery and then on merging values like "start date" and "end date" into "Duration" and "Time Period"
- Choosing features is very difficult, as is transforming data
  - Some features we wished to include were unfeasible
  - There were 90+ features for each of the 400 polities
- It would have been better to have a train-test split of the data
  - This was the most important think lacking in our project
  - It is a way to objectively test a model
- The frontend portion took the least amount of time

# References
- Data retrieved from Seshat: Global History Databank. Available at: http://seshatdatabank.info/
- Turchin, P., R. Brennan, T. E. Currie, K. Feeney, P. François, […] H. Whitehouse. 2015. “Seshat: The Global History Databank.” Cliodynamics 6(1): 77–107. https://doi.org/10.21237/C7clio6127917.
- Turchin, P., T. E. Currie, H. Whitehouse, P. François, K. Feeney,  […] C. Spencer. 2017. “Quantitative historical analysis uncovers a single dimension of complexity that structures global variation in human social organization.” PNAS. http://www.pnas.org/content/early/2017/12/20/1708800115.full.
- CPSC481_Lecture_20_S25 for reviewing the topic
- Homework 9 Question 2 for testing
- LLMs used for much of the code templates
