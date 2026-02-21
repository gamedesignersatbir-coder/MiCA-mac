import os
import sys

def validate_skill(name):
    print(f"Validating skill: {name}")
    if not os.path.exists(os.path.join(name, "SKILL.md")):
        print("Error: SKILL.md missing!")
        return False
    print("Validation passed!")
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        validate_skill(sys.argv[1])
    else:
        print("Usage: python quick_validate.py <skill_name>")
