import csv
import random
import os

def generate_student_csv(output_path, rows=5000, variant="standard"):
    first_names = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
    majors = ["Computer Science", "Biology", "Nursing", "Business", "Engineering", "Arts", "Psychology"]
    
    headers = {
        "standard": ["id", "first_name", "last_name", "email", "major", "gpa", "credits_earned"],
        "variant_1": ["UID", "fname", "lname", "email_address", "field_of_study", "grade_point_avg", "credits"],
        "variant_2": ["Student_ID", "Given_Name", "Surname", "Contact_Email", "Program", "GPA", "Completed_Credits"]
    }
    
    cols = headers.get(variant, headers["standard"])
    
    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=cols)
        writer.writeheader()
        
        for i in range(rows):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            major = random.choice(majors)
            email = f"{fname.lower()}.{lname.lower()}.{i}@university.edu"
            
            row = {
                cols[0]: f"STU-{10000+i}",
                cols[1]: fname,
                cols[2]: lname,
                cols[3]: email,
                cols[4]: major,
                cols[5]: round(random.uniform(2.0, 4.0), 2),
                cols[6]: random.randint(0, 120)
            }
            writer.writerow(row)

if __name__ == "__main__":
    base_path = "c:/Projects/AA/at/6_integration/sample_data"
    os.makedirs(base_path, exist_ok=True)
    
    print("Generating Module 1 (Student Profiles) variants...")
    generate_student_csv(os.path.join(base_path, "students_standard.csv"), variant="standard")
    generate_student_csv(os.path.join(base_path, "students_variant_1.csv"), variant="variant_1")
    generate_student_csv(os.path.join(base_path, "students_variant_2.csv"), variant="variant_2")
    
    print("Sample data generation complete.")
