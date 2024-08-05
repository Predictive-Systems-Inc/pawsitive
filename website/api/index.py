from fastapi import FastAPI
import pandas as pd

from api.firestore import get_user_swipes, init_firestore_client_service_account
from api.user_collaborative import build_user_item_matrix, user_complete


app = FastAPI()

init_firestore_client_service_account()

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.get("/api/pets")
def get_pet(user_name: str, user_id: str):

    # read pets.csv 
    pets = pd.read_csv("data/pets.csv")
    # get all the pet names
    pet_names = pets["name"]
    pets = pets.set_index("name", drop=False)

    # check if user has swiped on any pets
    current_user_swipes = get_user_swipes(user_id)
    
    if not current_user_swipes:
        # return 3 random pets
        pet = pets.sample(3)
        # for each record add method as random
        for index, row in pet.iterrows():
            pet.at[index, 'method'] = 'random'
        return pet.to_dict(orient="records")
    else:
        user_swipes_df = build_user_item_matrix(pet_names)
        no_swipe = user_swipes_df.loc[user_name][user_swipes_df.loc[user_name].isnull()].index
       
        if no_swipe.empty:
            return []
        # return top 3 similar users based on user collaborative filtering
        complete_user = user_complete(user_swipes_df, 3)
        top_3_recommendations =  complete_user.loc[user_name, no_swipe].sort_values(ascending=False).head(3).index
        print(top_3_recommendations)
        # find the pet name for the top 3 recommendations
        pet = pets.loc[top_3_recommendations]
        # for each record add method as user collaborative filtering
        for index, row in pet.iterrows():
            pet.at[index, 'method'] = 'user collaborative filtering'
        return pet.to_dict(orient="records")

