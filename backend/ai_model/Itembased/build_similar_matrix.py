from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import jieba
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv
import warnings
warnings.filterwarnings("ignore", category=UserWarning, message=".*pandas.*")

load_dotenv("./secret/.env")

connection = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DB"),
)

SAVE_PATH=os.getenv("SIMILAR_MATRIX_PATH")

def custom_tokenizer(text):
    if any(ord(c) > 127 for c in text):
        # Chinese text
        words = jieba.cut(text)
    else:
        # English text
        words = word_tokenize(text)

    return words

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
        
    # calculate cosine similarity
    vectorizer = TfidfVectorizer(tokenizer=custom_tokenizer, stop_words=stopwords.words('english'))
    tfidf_matrix = vectorizer.fit_transform(df_combined["combined"])
    cosine_sim = cosine_similarity(tfidf_matrix.toarray())
    cosine_sim_df = pd.DataFrame(cosine_sim, index=df_combined["id"], columns=df_combined["id"])
        
    # save cosine similarity matrix to npy file
    cosine_sim_df.to_csv(SAVE_PATH)
    
    
if __name__ == "__main__" :
    build_similar_matrix()