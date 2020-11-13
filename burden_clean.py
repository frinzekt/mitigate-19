import pandas as pd
import numpy as np

df = pd.read_csv("burden_of_disease.csv")
desired_cols = [
    "cause",
    "location",
    "val"
]
df = df[:][desired_cols]
df = df[df["cause"] == "Respiratory infections and tuberculosis"]
df = df[:][["location", "val"]]
df.to_csv("respiratory.csv", index=False)