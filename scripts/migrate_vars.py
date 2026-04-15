import os
import subprocess

def migrate_env():
    if not os.path.exists(".env.old"):
        print("Error: .env.old not found")
        return

    with open(".env.old", "r") as f:
        lines = f.readlines()

    for line in lines:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        
        if "=" in line:
            key, value = line.split("=", 1)
            # Remove quotes if present
            value = value.strip('"').strip("'")
            print(f"Migrating {key}...")
            # Use subprocess to run 'vercel env add'
            try:
                # Add to all environments
                # Use shell=True for Windows command finding
                subprocess.run(f'echo {value} | vercel env add {key} production --yes', shell=True, check=True)
                subprocess.run(f'echo {value} | vercel env add {key} preview --yes', shell=True, check=True)
                subprocess.run(f'echo {value} | vercel env add {key} development --yes', shell=True, check=True)
            except Exception as e:
                print(f"Failed to migrate {key}: {e}")

if __name__ == "__main__":
    migrate_env()
