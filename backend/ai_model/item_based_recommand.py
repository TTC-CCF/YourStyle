from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db_connection import connection
import pandas as pd

SAVE_PATH="matrixes/similar_matrix.npy"

def build_similar_matrix() :
    # get post data from db
    cursor = connection.cursor()
    cursor.execute("SELECT post.id, post.title, post.description, tag.name FROM post JOIN tag ON post.id = tag.post_id")
    posts = cursor.fetchall()
    cursor.close()
    
    # convert to dataframe
    df = pd.DataFrame(posts, columns=["id", "title", "description", "name"])
    # create a new dataframe to store combined data
    df_combined = pd.DataFrame(columns=["id", "combined"])
    df_combined["id"] = df["id"].unique()
    tmp = df.groupby("id").agg({"name": lambda x: " ".join(x), "title": lambda x: x.iloc[0], "description": lambda x: x.iloc[0]}).reset_index()
    df_combined["combined"] = tmp["name"] + " " + tmp["title"] + " " + tmp["description"]
    print(df_combined)
    
    # calculate cosine similarity
    cv = CountVectorizer()
    count_matrix = cv.fit_transform(df_combined["combined"])
    cosine_sim = cosine_similarity(count_matrix)
    
    # save cosine similarity matrix to npy file
    import numpy as np
    np.save(SAVE_PATH, cosine_sim)
    print("similar_matrix.npy saved")
    
if __name__ == "__main__" :
    build_similar_matrix()