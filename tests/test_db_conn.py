import os, sys

os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
sys.path.insert(0, 'api/core/backend')

from dotenv import load_dotenv
load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:////tmp/database.db')
print(f'DB URL scheme: {DATABASE_URL.split("://")[0]}')

if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

if 'postgresql' in DATABASE_URL:
    clean_url = DATABASE_URL.split('?')[0]
    print(f'clean_url: {clean_url[:60]}...')

from sqlmodel import create_engine
import sqlalchemy
engine = create_engine(clean_url, echo=False, pool_size=20, max_overflow=10, pool_pre_ping=True, connect_args={'sslmode': 'require'})
print('Engine created OK')

with engine.connect() as conn:
    result = conn.execute(sqlalchemy.text('SELECT 1'))
    print(f'Connection test: {result.fetchone()}')

print('DB Connection SUCCESS')
