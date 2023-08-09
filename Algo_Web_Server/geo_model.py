import os
from sys import platform

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score
import random
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.svm import SVC
import pickle

from texts import subject,subject_labels,subject_labels_2

def create_database(data, data_labels):
    new_data = {'sentence': [], 'class': []}
    i = 0
    for sub in data:
        for text in sub:
            new_data['sentence'].append(text)
            new_data['class'].append(data_labels[i])
        i += 1

    df = pd.DataFrame(new_data)
    return df

class SVM_Text_Model:
    def __init__(self, df):
        # df = create_database(data,data_labels)
        random_number = random.randint(1, 150)
        X_train, X_test, y_train, y_test = train_test_split(df['sentence'], df['class'], test_size=0.2,
                                                            random_state=random_number)
        vectorizer = TfidfVectorizer()
        X_train = vectorizer.fit_transform(X_train)
        X_test = vectorizer.transform(X_test)
        svm = LinearSVC()
        # svm = LinearSVC(multi_class='crammer_singer',penalty='l1',dual=False,tol=0.005)
        svm.fit(X_train, y_train)
        y_pred = svm.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print("Training Accuracy:", accuracy)

        self.svm = svm
        self.vectorizer = vectorizer
        with open('geometry_svm_model.pkl', 'wb') as file:
            pickle.dump(self.svm, file)
        with open('geometry_vectorizer_model.pkl', 'wb') as file:
            pickle.dump(self.vectorizer, file)

    def SVM_Single_Pred(self, text):
        new_text_transformed = self.vectorizer.transform([text])
        predicted_label = self.svm.predict(new_text_transformed)[0]
        decision_scores = self.svm.decision_function(new_text_transformed)

        # convert decision function scores to probabilities using softmax function
        probs = np.exp(decision_scores) / np.sum(np.exp(decision_scores), axis=1)

        # get the top 3 classes with the highest predicted probabilities
        # top_3_classes = probs.argsort()[0][-3:][::-1]
        print('Single pred result is:', predicted_label)
        
df = create_database(subject,subject_labels_2)
    
my_svm = SVM_Text_Model(df)
my_svm.SVM_Single_Pred('Line A line has one dimension. It is represented by a line with two arrowheads, but it extends without end.')