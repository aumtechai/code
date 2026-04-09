from app.auth import engine
from sqlalchemy import text, inspect

def migrate_roles():
    print("Checking for role columns (is_advisor, is_dean, is_exec)...")
    inspector = inspect(engine)
    existing_columns = [c["name"] for c in inspector.get_columns("user")]
    
    roles = ["is_advisor", "is_dean", "is_exec"]
    for role in roles:
        if role not in existing_columns:
            print(f"Column '{role}' missing. Adding it...")
            with engine.connect() as conn:
                try:
                    conn.execute(text(f'ALTER TABLE "user" ADD COLUMN {role} BOOLEAN DEFAULT FALSE;')) 
                    conn.commit()
                    print(f"Successfully added column '{role}'.")
                except Exception as e:
                    print(f"Error adding column '{role}': {e}")
        else:
            print(f"Column '{role}' already exists.")

if __name__ == "__main__":
    migrate_roles()
