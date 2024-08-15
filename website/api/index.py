import datetime
import random
from fastapi import FastAPI
import pandas as pd
import json
import numpy as np

from api.firestore import get_user_profile, get_user_swipes, init_firestore_client_service_account
from api.user_collaborative import build_user_item_matrix, get_top_k_similar_users, user_complete, find_least_liked_pets
from google.api_core.datetime_helpers import DatetimeWithNanoseconds
app = FastAPI()

init_firestore_client_service_account()

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, float):
            print(obj)
            if np.isnan(obj):
                return "NaN"
            elif np.isinf(obj):
                return "Infinity" if obj > 0 else "-Infinity"
        return super(CustomJSONEncoder, self).default(obj)

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.get("/api/analyze")
def analyze(user_id: str):
    # read pets.csv 
    pets = pd.read_csv("data/pets.csv")
    # get all the pet names
    pet_names = pets["name"]
    pets = pets.set_index("name", drop=False)

    # check if user has swiped on any pets
    current_user_swipes = get_user_swipes(user_id)
    
    if not current_user_swipes:
        return []
    else:
        user_swipes_df = build_user_item_matrix(pet_names)
        no_swipe = user_swipes_df.loc[user_id][user_swipes_df.loc[user_id].isnull()].index
       
        # if no_swipe.empty:
        #     return []
        # return top 3 similar users based on user collaborative filtering
        top_k = get_top_k_similar_users(user_id, user_swipes_df, 10).to_dict()

        # add user to dict
        top_k[user_id] = 1.0

        # convert all NaN to "NaN" to avoid errors in JSON serialization
        user_swipes_df = user_swipes_df.fillna("NaN")
        # convert NaN in  top_k to "NaN" to avoid errors in JSON serialization
        for k in top_k.keys():
            if np.isnan(top_k[k]):
                top_k[k] = "NaN"

        result = {}
        # add the swipes of the top k users
        for k in top_k.keys():
            result[k] = {
                "similarity": top_k[k],
                "swipes": user_swipes_df.loc[k].to_dict()
            }
        json_response = json.dumps(result)
        print(json_response)
        return json_response
    
@app.get("/api/pets")
def get_pet(user_name: str, user_id: str, training: bool = False):

    # read pets.csv 
    pets = pd.read_csv("data/pets.csv")
    # get all the pet names
    pet_names = pets["name"]
    pets = pets.set_index("name", drop=False)

    # check if user has swiped on any pets
    current_user_swipes = get_user_swipes(user_id)
    
    if training or not current_user_swipes:
        # return 3 random pets
        pet = pets.sample(5)
        # for each record add method as random
        for index, row in pet.iterrows():
            pet.at[index, 'method'] = 'random'
        return pet.to_dict(orient="records")
    else:
        method = 'user'
        user_swipes_df = build_user_item_matrix(pet_names)
        no_swipe = user_swipes_df.loc[user_id][user_swipes_df.loc[user_id].isnull()].index
       
        if no_swipe.empty:
            return []
        # return top 5 similar users based on user collaborative filtering
        complete_user = user_complete(user_swipes_df, 5)
        top_recommendations =  complete_user.loc[user_id, no_swipe].sort_values(ascending=False)
        # limit to positive values only
        top_recommendations = top_recommendations[top_recommendations > 0].head(5)
        print('Top Recommendations:', top_recommendations) 

        # if none to recommend, let's use the least liked pets
        if top_recommendations.empty:
            top_recommendations = find_least_liked_pets(user_swipes_df, 8)
            method = 'least'
            print('Least Liked:', top_recommendations)

        # find the pet name for the top recommendations
        pet = pets.loc[top_recommendations.index]
        for index, row in pet.iterrows():
            if method == 'least':
                # change the label to 'most liked' or 'least liked'
                if random.random() < 0.5:
                    pet.at[index, 'method'] = 'most liked'
                else:
                    pet.at[index, 'method'] = 'least liked'
            else:
              pet.at[index, 'method'] = method

        # for each record add method as user collaborative filtering
        return pet.to_dict(orient="records")

