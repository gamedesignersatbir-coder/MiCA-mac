import json
import sys
import os

def generate_structure(product_name, transformation, mechanism):
    structure = {
        "hero": {
            "header": f"{transformation} with {product_name}",
            "subheader": f"The easiest way to {transformation.lower()} using {mechanism}. No fluff, just results.",
            "cta": "Start Now - It's Free"
        },
        "social_proof": [
            "Join 1,000+ experts using our tool.",
            "As seen on TechCrunch & Product Hunt."
        ],
        "value_props": [
            {
                "title": f"Effortless {transformation}",
                "description": f"We use {mechanism} to automate the hard parts of your workflow."
            },
            {
                "title": "Save Hours Every Week",
                "description": "Stop doing manual labor and focus on what matters."
            }
        ],
        "objection_handling": {
            "q": "How long does setup take?",
            "a": "Less than 2 minutes. We've optimized every step."
        },
        "footer_cta": "Ready to transform your workflow?"
    }
    
    print(json.dumps(structure, indent=2))

if __name__ == "__main__":
    if len(sys.argv) > 3:
        generate_structure(sys.argv[1], sys.argv[2], sys.argv[3])
    else:
        print("Usage: python generate_structure.py <ProductName> <Transformation> <Mechanism>")
