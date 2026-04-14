from sqlalchemy import create_engine
import pandas as pd

url="postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(url)
q = "select email, is_admin, is_faculty, is_dean, is_advisor from \"user\" where email in ('student@university.edu', 'faculty@university.edu', 'admin@university.edu', 'audit.dean@aumtech-ai.com')"
print(pd.read_sql(q, engine))
