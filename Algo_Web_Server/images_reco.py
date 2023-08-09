import os
import sys

from tensorflow.keras.applications.convnext import ConvNeXtBase, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import cv2


def return_image_embedding(model, img_path, label=None):
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    preds = model.predict(x)
    curr_df = pd.DataFrame(preds[0]).T
    if label is not None:
        curr_df["label"] = label
    return curr_df


def predict_single_img_knn(model, image, df, num_of_neigh):
    y = df["label"]
    x = df.drop("label", axis=1)
    knn = NearestNeighbors(n_neighbors=num_of_neigh, metric="cosine")
    knn.fit(x, y)
    img_emb = pd.DataFrame(return_image_embedding(model, image))
    res = knn.kneighbors(img_emb)
    neigh_label_arr = []
    for idx in res[1]:
        s = y.iloc[idx]
        neigh_label_arr = list(s)
    dist = distribution(neigh_label_arr)
    majority = majority_voting(neigh_label_arr)
    # return dist, majority
    return dist


def majority_voting(prediction_label_arr):
    counter = 0
    label = prediction_label_arr[0]

    for element in prediction_label_arr:
        curr_frequency = prediction_label_arr.count(element)
        if curr_frequency > counter:
            counter = curr_frequency
            label = element

    return label


def distribution(prediction_label_arr):
    dist_dict = {}
    for element in prediction_label_arr:
        if element not in dist_dict:
            dist_dict[element] = 1
        else:
            curr_dist = dist_dict[element]
            dist_dict[element] = (curr_dist + 1)
    for element in dist_dict:
        dist_dict[element] = float(dist_dict[element]/len(prediction_label_arr))
    return dist_dict


def recognize_new_image(df, img_to_rec):
    model = ConvNeXtBase(include_top=False, weights='imagenet', pooling='avg')
    k = 5
    prediction = predict_single_img_knn(model, img_to_rec, df, k)
    return prediction


def mse(image1, image2):
    img1 = cv2.imread(image1)
    img2 = cv2.imread(image2)

    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    h, w = img1.shape
    diff = cv2.subtract(img1, img2)
    err = np.sum(diff ** 2)
    mse = err / (float(h * w))
    return mse, diff




