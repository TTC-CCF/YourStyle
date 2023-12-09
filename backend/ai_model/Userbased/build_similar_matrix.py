from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse.linalg import svds
import pandas as pd

import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv
import warnings
warnings.filterwarnings("ignore", category=UserWarning, message=".*pandas.*")

load_dotenv("../../secret/.env")

connection = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DB"),
)

SAVE_PATH=os.getenv("USER_SIMILAR_MATRIX_PATH")


def build_similar_matrix() :
    # get post data from db
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM user_post_score")
    posts = cursor.fetchall()
    cursor.close()
    
    # convert to dataframe
    df = pd.DataFrame(posts, columns=["user_id", "post_id", "score"])
    
    # Transpose the dataframe
    df_transposed = df.pivot(index='user_id', columns='post_id', values='score')
    avg_rating = df_transposed.mean(axis=1)
    avg_rating = df_transposed.sub(avg_rating, axis=0)

    cosine_sim = cosine_similarity(avg_rating.to_numpy())
    
    # save cosine similarity matrix to csv file
    cosine_sim_df = pd.DataFrame(cosine_sim, index=avg_rating.index, columns=avg_rating.index)
    print(cosine_sim_df)
    cosine_sim_df.to_csv(SAVE_PATH)
    
if __name__ == "__main__" :
    print("Building similar matrix...")
    build_similar_matrix()
    print("Done!")