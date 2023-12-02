import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv
import warnings
warnings.filterwarnings("ignore", category=UserWarning, message=".*pandas.*")

load_dotenv("../.env")

connection = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DB"),
)