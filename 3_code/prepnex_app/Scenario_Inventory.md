# PrepNex Admissions Scenario Inventory

This inventory documents the 8 core admissions scenarios seeded into the database (Total: 5000+ Students). Use the **Static IDs** for quick verification of specific boundary cases.

## 🚀 Scenario Cheat Sheet

| Scenario # | Persona | Key Attributes | Static Test ID (UUID) |
| :--- | :--- | :--- | :--- |
| **S1** | **The Ivy Prodigy** | 4.0 GPA, 1550+ SAT, Reach-Heavy List | `00000000-0000-0000-0000-000000000001` |
| **S2** | **Under-Matched** | 1500+ SAT, ~2.8 GPA (Potential Disconnect) | `00000000-0000-0000-0000-000000000002` |
| **S3** | **The EC Workhorse** | ~3.5 GPA, High Active Profile Activity Count | `00000000-0000-0000-0000-000000000003` |
| **S4** | **Financial Aid Need** | High GPA, Low Family Income, Match-Score Heavy | `00000000-0000-0000-0000-000000000004` |
| **S5** | **International** | Overseas Applicant, Tier 1 GPA/SAT | `00000000-0000-0000-0000-000000000005` |
| **S6** | **Safety Focus** | ~2.3 GPA, Safety-Only School List | `00000000-0000-0000-0000-000000000006` |
| **S7** | **Testing Struggler**| 4.0 GPA, <1100 SAT (Divergent Profile) | `00000000-0000-0000-0000-000000000007` |
| **S8** | **The Ghost** | Minimal Data, Empty Profile State | `00000000-0000-0000-0000-000000000008` |

---

## 🛠 How to Test Random Samples

The database has 4,992 additional random records. To find more specific cases, run these SQL queries in your Supabase Editor:

### Find Elite Students
```sql
SELECT id FROM students WHERE gpa > 3.9 AND sat_score > 1550 LIMIT 5;
```

### Find Students needing Financial Aid
```sql
SELECT id FROM students WHERE family_income_est < 40000 LIMIT 5;
```

### Find Students with Safety Lists
```sql
SELECT student_id FROM student_universities WHERE tier = 'Safety' GROUP BY student_id LIMIT 5;
```

## 🔄 Login Verification Procedure
To see the UI for any scenario:
1. Append the ID to your URL: `?id=[ID]`
2. Example for **Elite Student**: `.../dashboard.html?id=00000000-0000-0000-0000-000000000001`
