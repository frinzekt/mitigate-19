import pandas as pd
import numpy as np

beds_df = pd.read_csv("hospital_beds.csv")
health_df = pd.read_csv("health_expenditure.csv")
smoking_df = pd.read_csv("smoking_prevalence.csv")

# print(health_df.head())
# print(smoking_df.head())
# print(beds_df.head())
beds_df = pd.pivot(index=["Country Name"], columns="Series Name", values="2011 [YR2011]", data=beds_df)
health_df = pd.pivot(index=["Country Name"], columns="Series Name", values="2017 [YR2017]", data=health_df)
smoking_df = pd.pivot(index=["Country Name"], columns="Series Name", values="2016 [YR2016]", data=smoking_df)
beds_df.to_csv("beds.csv")
health_df.to_csv("health.csv")
smoking_df.to_csv("smoking.csv")