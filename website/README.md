There are 6 preset user to initialize the data.
1.) Dog Lover
2.) Cat Lover
3.) Younglings - 3 years and below
4.) Seniors - 6 years and older
5.) All Pets
6.) No Pets

There are 3 algorithms used for recommendation:
1.) Random - First 5 pets are random
2.) User Collaborative - Recommends pets from top 5 similar. Reject users not similar.
                       - Recommends pets that are liked and reject disliked pets.
3.) Least Liked - When nothing else to recommend, we give the least liked pets.

We switch from Adj_Cos to Jaccard Distance because Adj_Cos cannot handle when norm is zero (Swipe Yes on All).
In Jaccard Distance, 

Evaluate: 