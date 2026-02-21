import os
import sys

def init_skill(name):
    print(f"Initializing skill: {name}")
    os.makedirs(name, exist_ok=True)
    with open(os.path.join(name, "SKILL.md"), "w") as f:
        f.write(f"# {name}\n\nDescription goes here.")
    print("Skill initialized successfully.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        init_skill(sys.argv[1])
    else:
        print("Usage: python init_skill.py <skill_name>")
