import pandas as pd
import numpy as np
from datetime import datetime


def owid_date_parser(x): return datetime.strptime(x,  "%Y-%m-%d")


def oxford_date_parser(x): return datetime.strptime(x, "%Y%m%d")


owid_df = pd.read_csv(
    "owid-covid-data.csv", parse_dates=["date"], date_parser=owid_date_parser)
oxford_df = pd.read_csv(
        "oxford_gov_responses.csv", parse_dates=["Date"],
        date_parser=oxford_date_parser)

owid_df = owid_df[owid_df[:]["iso_code"].apply(lambda x: isinstance(x, str))]
oxford_df["CountryCode"] = oxford_df["CountryCode"].astype(str)
print(len(np.unique(owid_df["iso_code"])))
print(len(np.unique(oxford_df["CountryCode"])))
df = owid_df.merge(oxford_df, left_on=["iso_code"], right_on=["CountryCode"], how="left")
