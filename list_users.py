from sqlalchemy import create_engine
import pandas as pd
import os

url="postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(url)
print(pd.read_sql('select email, is_admin, is_faculty, full_name, is_dean, password_hash from "user"', engine))
