# Copyright 2022 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from firebase_admin import firestore
from dotenv import load_dotenv
import pathlib
import os

basedir = pathlib.Path(__file__).parents[1]
load_dotenv(basedir / ".env")

# pylint: disable=invalid-name
def init_firestore_client():
    # [START init_firestore_client]
    import firebase_admin
    from firebase_admin import firestore

    # Application Default credentials are automatically created.
    app = firebase_admin.initialize_app()
    db = firestore.client()
    # [END init_firestore_client]

def init_firestore_client_application_default():
    # [START init_firestore_client_application_default]
    import firebase_admin
    from firebase_admin import credentials
    from firebase_admin import firestore

    # Use the application default credentials.
    cred = credentials.ApplicationDefault()

    firebase_admin.initialize_app(cred)
    db = firestore.client()
    # [END init_firestore_client_application_default]

def init_firestore_client_service_account():
    # [START init_firestore_client_service_account]
    import firebase_admin
    from firebase_admin import credentials
    from firebase_admin import firestore

    # Use a service account.
    cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
    app = firebase_admin.initialize_app(cred)
    db = firestore.client()
    # [END init_firestore_client_service_account]

def read_user_with_swipes():
    import firebase_admin
    from firebase_admin import firestore

    # app = firebase_admin.initialize_app()
    db = firestore.client()
    swipes = db.collection_group('swipes').stream()
    user_swipes = []
    for swipe in swipes:
            user_swipes.append(swipe.to_dict())
    return user_swipes

    # [END read_data]

def get_all_users():
    from firebase_admin import firestore
    db = firestore.client()

    # [START get_user_profile]
    user_profile_ref = db.collection('user_profile')
    user_query = user_profile_ref.stream()
    user_data = []
    for user in user_query:
        # Access the document ID
        user_id = user.id        
        # Convert the document to a dictionary
        user_dict = user.to_dict()
        # Add the user ID to the dictionary
        user_dict['uid'] = user_id
        # Append the dictionary with the user ID to the list
        user_data.append(user_dict)
    return user_data
    # [END get_user_profile]
    
def get_user_profile(user_id):
    from firebase_admin import firestore
    db = firestore.client()

    # [START get_user_profile]
    user_profile_ref = db.collection('user_profile').document(user_id)
    user_profile = user_profile_ref.get()
    return user_profile.to_dict()
    # [END get_user_profile]

def get_user_swipes(user_id):
    from firebase_admin import firestore
    db = firestore.client()

    # [START get_user_swipes]
    swipes_ref = db.collection('user_profile').document(user_id).collection('swipes')
    swipes_query = swipes_ref.stream()
    swipes_data = []
    for swipe in swipes_query:
        swipes_data.append(swipe.to_dict())
    return swipes_data
    # [END get_user_swipes]

def add_data():
    import firebase_admin
    from firebase_admin import firestore

    app = firebase_admin.initialize_app()
    db = firestore.client()

    # [START add_data]
    doc_ref = db.collection("users").document("alovelace")
    doc_ref.set({
        "first": "Ada",
        "last": "Lovelace",
        "born": 1815
    })
    # [END add_data]