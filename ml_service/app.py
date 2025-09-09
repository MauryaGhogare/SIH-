# # from flask import Flask, request, jsonify
# # from flask_cors import CORS
# # from test_model import model, transform, class_labels, predict_image
# # import os
# # from werkzeug.utils import secure_filename

# # app = Flask(__name__)
# # CORS(app)

# # # Folder to save uploaded images
# # UPLOAD_FOLDER = 'uploads'
# # os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# # app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# # # Allowed extensions
# # ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# # def allowed_file(filename):
# #     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# # @app.route('/predict', methods=['POST'])
# # def predict():
# #     if 'image' not in request.files:
# #         return jsonify({'error': 'No file part'}), 400
    
# #     file = request.files['image']
# #     if file.filename == '':
# #         return jsonify({'error': 'No selected file'}), 400

# #     if file and allowed_file(file.filename):
# #         filename = secure_filename(file.filename)
# #         filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
# #         file.save(filepath)

# #         # Make prediction
# #         prediction = predict_image(filepath, model, transform, class_labels)
# #         return jsonify({'prediction': prediction})

# #     return jsonify({'error': 'Invalid file type'}), 400

# # if __name__ == '__main__':
# #     app.run(debug=True)






# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from test_model import model, transform, class_labels, predict_image
# import os
# from werkzeug.utils import secure_filename

# app = Flask(__name__)
# CORS(app)

# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
    
#     file = request.files['image']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(filepath)

#         prediction = predict_image(filepath, model, transform, class_labels)
#         return jsonify({'prediction': prediction})

#     return jsonify({'error': 'Invalid file type'}), 400

# if __name__ == '__main__':
#     app.run(debug=True)




# # ml_service/app.py

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from test_model import model, transform, class_labels
# from PIL import Image
# import io
# import torch

# app = Flask(__name__)
# CORS(app)

# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No image file provided'}), 400

#     file = request.files['image']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     if file and allowed_file(file.filename):
#         try:
#             img_bytes = file.read()
#             image = Image.open(io.BytesIO(img_bytes)).convert('RGB')
#         except Exception as e:
#             return jsonify({'error': 'Invalid image file', 'details': str(e)}), 400

#         img_t = transform(image)
#         batch_t = torch.unsqueeze(img_t, 0)

#         model.eval()
#         with torch.no_grad():
#             outputs = model(batch_t)
#             _, pred = torch.max(outputs, 1)
#             predicted_label = class_labels[pred.item()]

#         return jsonify({'prediction': predicted_label})

#     return jsonify({'error': 'Invalid file type'}), 400

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)



# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from test_model import predict_image
# import os
# from werkzeug.utils import secure_filename

# app = Flask(__name__)
# CORS(app)

# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
#     file = request.files['image']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(filepath)
#         prediction = predict_image(filepath)
#         return jsonify({'prediction': prediction})
#     return jsonify({'error': 'Invalid file type'}), 400

# if __name__ == '__main__':
#     app.run(debug=True)









from flask import Flask, request, jsonify
from PIL import Image
import io
import torch
from torchvision import transforms
import os
from test_model_classes import ResNet9
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and set to eval mode
model_path = os.path.join(os.path.dirname(__file__), 'model', 'plant-disease-model-complete.pth')
num_classes = 38
model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)
model.eval()

# Class labels
class_labels = [
    "Apple__Apple_scab", "Apple_Black_rot", "Apple_Cedar_apple_rust", "Apple__healthy",
    "Blueberry__healthy", "Cherry(including_sour)Powdery_mildew", "Cherry(including_sour)_healthy",
    "Corn_(maize)Cercospora_leaf_spot Gray_leaf_spot", "Corn(maize)Common_rust", "Corn_(maize)_Northern_Leaf_Blight",
    "Corn_(maize)healthy", "Grape_Black_rot", "Grape_Esca(Black_Measles)", "Grape__Leaf_blight(Isariopsis_Leaf_Spot)",
    "Grape__healthy", "Orange_Haunglongbing(Citrus_greening)", "Peach__Bacterial_spot", "Peach__healthy",
    "Pepper,bell_Bacterial_spot", "Pepper,_bell_healthy", "Potato_Early_blight", "Potato__Late_blight",
    "Potato__healthy", "Raspberry_healthy", "Soybean_healthy", "Squash_Powdery_mildew", "Strawberry__Leaf_scorch",
    "Strawberry__healthy", "Tomato_Bacterial_spot", "Tomato_Early_blight", "Tomato_Late_blight", "Tomato__Leaf_Mold",
    "Tomato__Septoria_leaf_spot", "Tomato_Spider_mites Two-spotted_spider_mite", "Tomato__Target_Spot",
    "Tomato__Tomato_Yellow_Leaf_Curl_Virus", "Tomato_Tomato_mosaic_virus", "Tomato__healthy"
]

# Image preprocessing transform (same as training)
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def predict_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img_t = transform(image)
    batch_t = torch.unsqueeze(img_t, 0)
    
    with torch.no_grad():
        outputs = model(batch_t)
        _, predicted = torch.max(outputs, 1)
        return class_labels[predicted.item()]

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        img_bytes = file.read()
        prediction = predict_image(img_bytes)
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/")
def home():
    return "Flask app is running successfully!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)