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
    def __init__(self):
        
        # Algo_Web_Server
        if platform == "win32":
            # svm_path = os.getcwd() + "/Model_dir/svm_clean_model.pkl"
            # tfidf_path = os.getcwd() + "/Model_dir/tfidf_clean_vectorizer.pkl"
            svm_path = os.getcwd() + "/Model_dir/geometry_svm_model.pkl"
            tfidf_path = os.getcwd() + "/Model_dir/geometry_vectorizer_model.pkl"
            # svm_path = "Algo_Web_Server\Model_dir\geometry_svm_model.pkl"
            # tfidf_path = "Algo_Web_Server\Model_dir\geometry_vectorizer_model.pkl"
            # svm_path = "Algo_Web_Server\Model_dir\svm_clean_model.pkl"
            # tfidf_path = "Algo_Web_Server\Model_dir\\tfidf_clean_vectorizer.pkl"
        else:
            svm_path = os.getcwd() + "/Model_dir/svm_clean_model.pkl"
            tfidf_path = os.getcwd() + "/Model_dir/tfidf_clean_vectorizer.pkl"
            # svm_path = "Algo_Web_Server\Model_dir\svm_clean_model.pkl"
            # tfidf_path = "Algo_Web_Server\Model_dir\\tfidf_clean_vectorizer.pkl"
        with open(svm_path, 'rb') as f:
            svm = pickle.load(f)

        with open(tfidf_path, 'rb') as f:
            vectorizer = pickle.load(f)
        self.svm = svm
        self.vectorizer = vectorizer
        self.previous_result = 'None'
        self.prev_list = []
        self.classes = self.svm.classes_

    def svm_single_pred(self, text):
        multiplier = 1
        # multiplier = 1.2
        size = 1
        # size = 3
        labels = self.classes

        new_text_transformed = self.vectorizer.transform([text])
        predicted_label = self.svm.predict(new_text_transformed)[0]
        decision_scores = self.svm.decision_function(new_text_transformed)

        # convert decision function scores to probabilities using softmax function
        probs = np.exp(decision_scores) / np.sum(np.exp(decision_scores), axis=1)
        if self.previous_result == 'None':
            max_index = np.argmax(probs)
            output = labels[max_index]
            self.previous_result = output
            self.prev_list.append(output)
        else:
            for prev in self.prev_list:
                prev_output_index = np.argwhere(labels == prev)[0][0]
                probs[0][prev_output_index] *= multiplier
            max_index = np.argmax(probs)
            output = labels[max_index]
            self.previous_result = output
            if len(self.prev_list) == size:
                self.prev_list.pop(0)
                self.prev_list.append(output)
            else:
                self.prev_list.append(output)

        print('Single pred result is:', output)
        # return output
        return probs[0]

        # print('Single pred result is:', predicted_label)
        # return predicted_label
        

class SVC_Text_Model:
    def __init__(self, df):
        # df = create_database(data,data_labels)
        random_number = random.randint(1, 150)
        X_train, X_test, y_train, y_test = train_test_split(df['sentence'], df['class'], test_size=0.2,
                                                            random_state=random_number)
        vectorizer = TfidfVectorizer()
        X_train = vectorizer.fit_transform(X_train)
        X_test = vectorizer.transform(X_test)
        svc = SVC(kernel='linear')
        # svm = LinearSVC(multi_class='crammer_singer',penalty='l1',dual=False,tol=0.005)
        svc.fit(X_train, y_train)
        y_pred = svc.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print("Training Accuracy:", accuracy)
        self.svm = svc
        self.vectorizer = vectorizer

    def SVC_Single_Pred(self, text):
        new_text_transformed = self.vectorizer.transform([text])
        predicted_label = self.svc.predict(new_text_transformed)[0]
        decision_scores = self.svc.decision_function(new_text_transformed)

        # convert decision function scores to probabilities using softmax function
        probs = np.exp(decision_scores) / np.sum(np.exp(decision_scores), axis=1)

        # get the top 3 classes with the highest predicted probabilities
        # top_3_classes = probs.argsort()[0][-3:][::-1]
        print('Single pred result is:', predicted_label)


class KKN_Text_Model():
    def __init__(self, data, data_labels):
        df = create_database(data, data_labels)
        random_number = random.randint(1, 150)
        X_train, X_test, y_train, y_test = train_test_split(df['sentence'], df['class'], test_size=0.2,
                                                            random_state=random_number)
        vectorizer = TfidfVectorizer()
        X_train = vectorizer.fit_transform(X_train)
        X_test = vectorizer.transform(X_test)
        neigh = KNeighborsClassifier(n_neighbors=25)
        neigh.fit(X_train, y_train)
        y_pred = neigh.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print("Training Accuracy:", accuracy)
        self.knn = neigh
        self.vectorizer = vectorizer

    def KNN_Single_Pred(self, text):
        new_text_transformed = self.vectorizer.transform([text])
        predicted_label = self.knn.predict(new_text_transformed)[0]
        print('Single pred result is:', predicted_label)


class MLP_Text_Model():
    def __init__(self, data, data_labels):
        df = create_database(data, data_labels)
        random_number = random.randint(1, 150)
        X_train, X_test, y_train, y_test = train_test_split(df['sentence'], df['class'], test_size=0.2,
                                                            random_state=random_number)
        vectorizer = TfidfVectorizer()
        X_train = vectorizer.fit_transform(X_train)
        X_test = vectorizer.transform(X_test)
        clf = MLPClassifier(random_state=random_number, max_iter=200, activation='tanh', learning_rate_init=0.005).fit(
            X_train, y_train)
        y_pred = clf.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print("Training Accuracy:", accuracy)
        self.clf = clf
        self.vectorizer = vectorizer

    def MLP_Single_Pred(self, text):
        new_text_transformed = self.vectorizer.transform([text])
        predicted_label = self.clf.predict(new_text_transformed)[0]
        print('Single pred result is:', predicted_label)


class DTC_Text_Model():
    def __init__(self, data, data_labels):
        df = create_database(data, data_labels)
        random_number = random.randint(1, 150)
        X_train, X_test, y_train, y_test = train_test_split(df['sentence'], df['class'], test_size=0.2,
                                                            random_state=random_number)
        vectorizer = TfidfVectorizer()
        X_train = vectorizer.fit_transform(X_train)
        X_test = vectorizer.transform(X_test)
        clf = DecisionTreeClassifier(random_state=random_number)
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print("Training Accuracy:", accuracy)
        self.clf = clf
        self.vectorizer = vectorizer

    def DTC_Single_Pred(self, text):
        new_text_transformed = self.vectorizer.transform([text])
        predicted_label = self.clf.predict(new_text_transformed)[0]
        print('Single pred result is:', predicted_label)


class AdaBoost_Text_Model():
    def __init__(self, data, data_labels):
        df = create_database(data, data_labels)
        random_number = random.randint(1, 150)
        X_train, X_test, y_train, y_test = train_test_split(df['sentence'], df['class'], test_size=0.2,
                                                            random_state=random_number)
        vectorizer = TfidfVectorizer()
        X_train = vectorizer.fit_transform(X_train)
        X_test = vectorizer.transform(X_test)
        clf = AdaBoostClassifier(n_estimators=100, random_state=random_number, learning_rate=0.1)
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print("Training Accuracy:", accuracy)
        self.clf = clf
        self.vectorizer = vectorizer

    def AdaBoost_Single_Pred(self, text):
        new_text_transformed = self.vectorizer.transform([text])
        predicted_label = self.clf.predict(new_text_transformed)[0]
        print('Single pred result is:', predicted_label)
        
        