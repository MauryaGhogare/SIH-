from pymongo import MongoClient

# ------------------------------
# 1. Connect to your Atlas cluster
# ------------------------------
uri = "mongodb+srv://mauryaghogare10_db_user:ttIILYg8w4Iw3XFL@agri-ai-cluster.3o6xaui.mongodb.net/?retryWrites=true&w=majority&appName=agri-ai-cluster"
client = MongoClient(uri)

# ------------------------------
# 2. Use your database & collection
# ------------------------------
db = client["crop_disease_db"]
diseases_col = db["diseases"]

# ------------------------------
# 3. Define the disease data
# ------------------------------
disease_data = [
    {"crop": "Apple", "disease": "Apple scab", "prevention": "Plant resistant varieties; apply fungicides; remove fallen leaves", "info": "Fungal disease causing dark, scabby lesions on leaves and fruit."},
    {"crop": "Apple", "disease": "Black rot", "prevention": "Remove infected branches; apply fungicides; prune regularly", "info": "Fungal infection causing black spots on leaves and fruit."},
    {"crop": "Apple", "disease": "Cedar apple rust", "prevention": "Remove nearby cedar trees; use fungicides", "info": "Fungal disease causing orange spots on leaves and fruit."},
    {"crop": "Apple", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Blueberry", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Cherry", "disease": "Powdery mildew", "prevention": "Apply fungicides; ensure proper air circulation; prune regularly", "info": "Fungal disease causing white powdery spots on leaves."},
    {"crop": "Cherry", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Corn", "disease": "Cercospora leaf spot Gray leaf spot", "prevention": "Use resistant varieties; rotate crops; remove infected residue", "info": "Fungal disease causing gray/brown spots on leaves."},
    {"crop": "Corn", "disease": "Common rust", "prevention": "Apply fungicides; plant resistant varieties", "info": "Rust pustules appear on leaves reducing photosynthesis."},
    {"crop": "Corn", "disease": "Northern Leaf Blight", "prevention": "Rotate crops; use resistant varieties; apply fungicides", "info": "Fungal disease causing elongated gray lesions on leaves."},
    {"crop": "Corn", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Grape", "disease": "Black rot", "prevention": "Prune infected branches; apply fungicides; keep foliage dry", "info": "Fungal disease causing black lesions on leaves and fruit."},
    {"crop": "Grape", "disease": "Esca (Black Measles)", "prevention": "Remove infected vines; maintain proper sanitation", "info": "Fungal disease causing black spots and rotting in grapes."},
    {"crop": "Grape", "disease": "Leaf blight (Isariopsis Leaf Spot)", "prevention": "Apply fungicides; ensure proper air circulation", "info": "Fungal spots on grape leaves affecting photosynthesis."},
    {"crop": "Grape", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Orange", "disease": "Haunglongbing (Citrus greening)", "prevention": "Use disease-free saplings; control vector insects", "info": "Bacterial disease causing yellowing leaves and poor fruit quality."},
    {"crop": "Peach", "disease": "Bacterial spot", "prevention": "Apply copper sprays; remove infected leaves and branches", "info": "Bacterial disease causing dark spots on leaves and fruit."},
    {"crop": "Peach", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Pepper, bell", "disease": "Bacterial spot", "prevention": "Apply copper sprays; avoid overhead irrigation", "info": "Bacterial disease causing leaf and fruit spots."},
    {"crop": "Pepper, bell", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Potato", "disease": "Early blight", "prevention": "Remove infected foliage; apply fungicides", "info": "Fungal disease causing dark concentric spots on leaves."},
    {"crop": "Potato", "disease": "Late blight", "prevention": "Remove infected plants; apply fungicides; avoid overhead watering", "info": "Fungal disease causing dark, wet lesions on leaves and tubers."},
    {"crop": "Potato", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Raspberry", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Soybean", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Squash", "disease": "Powdery mildew", "prevention": "Apply fungicides; ensure good air circulation; prune infected leaves", "info": "Fungal disease causing white powdery spots on leaves."},
    {"crop": "Strawberry", "disease": "Leaf scorch", "prevention": "Remove infected leaves; apply fungicides", "info": "Fungal disease causing brown lesions on leaves."},
    {"crop": "Strawberry", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."},
    {"crop": "Tomato", "disease": "Bacterial spot", "prevention": "Apply copper sprays; avoid overhead watering", "info": "Bacterial disease causing dark spots on leaves and fruit."},
    {"crop": "Tomato", "disease": "Early blight", "prevention": "Remove infected leaves; apply fungicides", "info": "Fungal disease causing brown concentric spots on leaves."},
    {"crop": "Tomato", "disease": "Late blight", "prevention": "Remove infected plants; apply fungicides; avoid overhead watering", "info": "Fungal disease causing dark, wet lesions on leaves and fruit."},
    {"crop": "Tomato", "disease": "Leaf Mold", "prevention": "Ensure proper ventilation; apply fungicides", "info": "Fungal disease causing yellow spots and mold on leaves."},
    {"crop": "Tomato", "disease": "Septoria leaf spot", "prevention": "Remove infected leaves; apply fungicides", "info": "Fungal disease causing small circular spots on leaves."},
    {"crop": "Tomato", "disease": "Spider mites Two-spotted spider mite", "prevention": "Use miticides; maintain humidity; remove heavily infested leaves", "info": "Pest infestation causing leaf damage and yellowing."},
    {"crop": "Tomato", "disease": "Target Spot", "prevention": "Apply fungicides; remove infected foliage", "info": "Fungal disease causing dark, target-shaped spots on leaves."},
    {"crop": "Tomato", "disease": "Tomato Yellow Leaf Curl Virus", "prevention": "Use resistant varieties; control whitefly vectors", "info": "Viral disease causing yellowing and curling of leaves."},
    {"crop": "Tomato", "disease": "Tomato mosaic virus", "prevention": "Use virus-free seeds; remove infected plants", "info": "Viral disease causing mosaic patterns on leaves."},
    {"crop": "Tomato", "disease": "Healthy", "prevention": "Maintain good agricultural practices", "info": "No disease detected."}
]

# ------------------------------
# 4. Insert all documents
# ------------------------------
result = diseases_col.insert_many(disease_data)

print(f"Inserted {len(result.inserted_ids)} documents into the 'diseases' collection")
