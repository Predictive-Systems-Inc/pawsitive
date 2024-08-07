from api.firestore import read_user_with_swipes
import numpy as np
import pandas as pd

def adj_cos(a, b):
    """
      Accepts two pandas `Series` and returns the pearson correlation
      between the two with respect to common non-null values. 
      Return `0` if there is no common non-null value or one of them has length `0`.
    """

    # Return 0 if one of them has length `0`
    if a.empty or b.empty:
        return 0

    common = pd.concat([a, b], axis=1).dropna()
    # Return 0 if there are no common non-null values
    if common.empty:
        return np.nan

    # lets get common values from both series
    a_common = a[common.index]
    b_common = b[common.index]

    # Calculate the pearson correlation
    a_mean = a_common.mean()
    b_mean = b_common.mean()
    a_diff = a_common - a_mean
    b_diff = b_common - b_mean

    dot_product = np.dot(a_diff, b_diff)
    norm_a = np.linalg.norm(a_diff)
    norm_b = np.linalg.norm(b_diff)

    # handle when norm is 0
    if norm_a == 0 or norm_b == 0:
        return np.nan

    return dot_product / (norm_a * norm_b)

def build_user_item_matrix(pet_names):
    """
      Accepts a list of pet names and returns a DataFrame of users and pets
    """
    # get all the users with swipes in firebase
    user_swipes = read_user_with_swipes()
    user_ids = list(set([user["userId"] for user in user_swipes]))
    print(user_ids) 
    # create a DataFrame of users and pets from user_swipes and pet_names
    user_swipes_df = pd.DataFrame(index=user_ids, columns=pet_names)
    # convert to matrix
    for swipe in user_swipes:
        user_swipes_df.at[swipe["userId"], swipe["petName"]] = 1 if swipe["direction"] == "right" else 0
    return user_swipes_df

def user_complete(df_utility, k):
    """
        Performs user-based collaborative filtering on the 
        utility matrix `df_utility` with top `k` similar users.
    """
    # Calculate the cosine similarity matrix
    similarity_matrix = pd.DataFrame(
        index=df_utility.index, columns=df_utility.index)
    for i in df_utility.index:
        for j in df_utility.index:
            similarity_matrix.loc[i, j] = adj_cos(
                df_utility.loc[i], df_utility.loc[j])

    # the diagonal of the similarity matrix should be nan to exclude the user itself
    np.fill_diagonal(similarity_matrix.values, np.nan)

    # Create a copy of the original matrix to fill in missing values
    completed_matrix = df_utility.copy()

    # Fill in missing values
    for user in df_utility.index:
        # get the average rating of the user
        user_mean_rating = df_utility.loc[user].mean()
        for item in df_utility.columns:
            if pd.isnull(df_utility.loc[user, item]):
                # Get the k most similar users
                similar_users = similarity_matrix.loc[user].sort_values(ascending=False, kind='mergesort').head(k)
                similar_users = similar_users[similar_users.index.isin(df_utility[item].dropna().index)]
                                
                # Get the weighted average rating of the k most similar users
                avg_rating = 0
                total_weight = 0
                for similar_user in similar_users.index:
                    if pd.notnull(df_utility.loc[similar_user, item]):
                        similarity = similarity_matrix.loc[user, similar_user]
                        # get the mean rating of the similar user that is not null
                        mean_rating = df_utility.loc[similar_user].mean()
                        avg_rating += similarity * \
                            (df_utility.loc[similar_user, item] - mean_rating)
                        total_weight += abs(similarity)
                if total_weight > 0:
                    completed_matrix.loc[user, item] = user_mean_rating + \
                        avg_rating / total_weight

    # Sort by increasing user or itemId if distance is the same
    completed_matrix = completed_matrix.sort_index(axis=0).sort_index(axis=1)
    return completed_matrix