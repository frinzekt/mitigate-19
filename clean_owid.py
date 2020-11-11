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
# oxford_df = oxford_df[np.logicalor(oxford_df["CountryCode"] != "USA"), np.logicaland((oxford_df["CountryCode"] == "USA" & oxford_df["RegionName"].isnull())]
oxford_df = oxford_df[np.logical_or(oxford_df["CountryCode"] != "USA", np.logical_and(oxford_df["CountryCode"] == "USA", oxford_df["RegionName"].isnull()))]
df = owid_df.merge(oxford_df, left_on=["iso_code", "date"], right_on=["CountryCode", "Date"], how="left")
df.drop("CountryName", inplace=True, axis="columns")
df.to_csv("owid_oxford_merged.csv", index=False)
