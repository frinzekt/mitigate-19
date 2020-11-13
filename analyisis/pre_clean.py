import pandas as pd

df = pd.read_csv("WDIData.csv")

desired_cols = [
    "Country Name",
    "Country Code",
    "Indicator Name",
    "Indicator Code",
    "2018"
]
df = df[:][desired_cols]
df.to_csv("cleaned.csv")