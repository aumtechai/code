from app.auth import engine
from sqlalchemy import text, inspect

def migrate_lecture_notes():
    print("Checking for missing columns in 'lecturenote' table...")
    inspector = inspect(engine)
    existing_columns = [c["name"] for c in inspector.get_columns("lecturenote")]
    
    columns_to_add = [
        ("action_items", "TEXT"),
        ("keywords", "TEXT"),
        ("follow_up_questions", "TEXT"),
        ("course_name", "VARCHAR"),
        ("professor_name", "VARCHAR"),
        ("duration_seconds", "INTEGER"),
        ("is_bookmarked", "BOOLEAN DEFAULT FALSE"),
        ("language", "VARCHAR DEFAULT 'English'")
    ]
    
    for col_name, col_type in columns_to_add:
        if col_name not in existing_columns:
            print(f"Column '{col_name}' missing. Adding it...")
            with engine.connect() as conn:
                try:
                    conn.execute(text(f'ALTER TABLE "lecturenote" ADD COLUMN {col_name} {col_type};')) 
                    conn.commit()
                    print(f"Successfully added column '{col_name}'.")
                except Exception as e:
                    print(f"Error adding column '{col_name}': {e}")
        else:
            print(f"Column '{col_name}' already exists.")

if __name__ == "__main__":
    migrate_lecture_notes()
