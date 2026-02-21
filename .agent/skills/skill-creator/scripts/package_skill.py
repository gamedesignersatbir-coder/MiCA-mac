import zipfile
import os
import sys

def package_skill(name):
    print(f"Packaging skill: {name}")
    with zipfile.ZipFile(f"{name}.zip", 'w') as zipf:
        for root, dirs, files in os.walk(name):
            for file in files:
                zipf.write(os.path.join(root, file))
    print(f"Skill packaged into {name}.zip")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        package_skill(sys.argv[1])
    else:
        print("Usage: python package_skill.py <skill_name>")
