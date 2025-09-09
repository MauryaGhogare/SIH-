import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.serialization
from torchvision import transforms
from PIL import Image
import os
from test_model_classes import ResNet9


# Define helper function
def accuracy(outputs, labels):
    _, preds = torch.max(outputs, dim=1)
    return torch.tensor(torch.sum(preds == labels).item() / len(preds))

# Base class for model
class ImageClassificationBase(nn.Module):
    def training_step(self, batch):
        images, labels = batch
        out = self(images)                
        loss = F.cross_entropy(out, labels)
        return loss
    
    def validation_step(self, batch):
        images, labels = batch
        out = self(images)                   
        loss = F.cross_entropy(out, labels)  
        acc = accuracy(out, labels)          
        return {"val_loss": loss.detach(), "val_accuracy": acc}
    
    def validation_epoch_end(self, outputs):
        batch_losses = [x["val_loss"] for x in outputs]
        batch_accuracy = [x["val_accuracy"] for x in outputs]
        epoch_loss = torch.stack(batch_losses).mean()      
        epoch_accuracy = torch.stack(batch_accuracy).mean()
        return {"val_loss": epoch_loss, "val_accuracy": epoch_accuracy} 
    
    def epoch_end(self, epoch, result):
        print("Epoch [{}], last_lr: {:.5f}, train_loss: {:.4f}, val_loss: {:.4f}, val_acc: {:.4f}".format(
            epoch, result['lrs'][-1], result['train_loss'], result['val_loss'], result['val_accuracy']))

# Convolution block
def ConvBlock(in_channels, out_channels, pool=False):
    layers = [nn.Conv2d(in_channels , out_channels , kernel_size=3, padding=1),
              nn.BatchNorm2d(out_channels),
              nn.ReLU(inplace=True)]
    if pool:
        layers.append(nn.MaxPool2d(4))
    return nn.Sequential(*layers)

# Your ResNet9 model architecture
class ResNet9(ImageClassificationBase):
    def __init__(self, in_channels, num_diseases):
        super().__init__()
        self.conv1 = ConvBlock(in_channels, 64)
        self.conv2 = ConvBlock(64, 128, pool=True)
        self.res1 = nn.Sequential(ConvBlock(128, 128), ConvBlock(128, 128))
        self.conv3 = ConvBlock(128, 256, pool=True)
        self.conv4 = ConvBlock(256, 512, pool=True)
        self.res2 = nn.Sequential(ConvBlock(512, 512), ConvBlock(512, 512))
        self.classifier = nn.Sequential(nn.MaxPool2d(4),
                                        nn.Flatten(),
                                        nn.Linear(512, num_diseases))
        
    def forward(self, xb):
        out = self.conv1(xb)
        out = self.conv2(out)
        out = self.res1(out) + out
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out
        out = self.classifier(out)
        return out

# ===== ADD SAFE GLOBALS for your custom class here =====
torch.serialization.add_safe_globals([ResNet9])

# Path to your saved model weights
# model_path = 'model/plant-disease-model-complete.pth'
model_path = os.path.join(os.path.dirname(__file__), 'model', 'plant-disease-model-complete.pth')


# Instantiate and load weights
num_classes = 38
# model = ResNet9(3, num_classes)
# state_dict = torch.load(model_path,  map_location=torch.device('cpu'))
# model.load_state_dict(state_dict)

model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)

# torch.serialization.add_safe_globals([ResNet9])
# model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)
model.eval()

# Class labels
class_labels = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy", "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy", "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight", "Potato___Late_blight",
    "Potato___healthy", "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew", "Strawberry___Leaf_scorch",
    "Strawberry___healthy", "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

# Image preprocessing same as training
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def predict_image(image_path, model, transform, labels):
    image = Image.open(image_path).convert('RGB')
    img_t = transform(image)
    batch_t = torch.unsqueeze(img_t, 0)
    with torch.no_grad():
        outputs = model(batch_t)
        _, predicted = torch.max(outputs, 1)
        return labels[predicted.item()]

# Change this to your image path
# test_image_path = '../plant-diseases-that-affect-cucumbers-and-how-to-treat-them.jpg'
test_image_path = '../Disease-Triangle-Blog.png'

predicted_class = predict_image(test_image_path, model, transform, class_labels)

print(f'Predicted class for image "{test_image_path}": {predicted_class}')







# import torch
# from torchvision import transforms
# from PIL import Image
# import os
# from test_model_classes import ResNet9  # your model class

# # Path to your model weights
# model_path = os.path.join(os.path.dirname(__file__), 'model', 'plant-disease-model-complete.pth')

# # 1️⃣ Instantiate your model first
# num_classes = 38
# model = ResNet9(3, num_classes)

# # 2️⃣ Load the weights only
# state_dict = torch.load(model_path, map_location=torch.device('cpu'))
# model.load_state_dict(state_dict)
# model.eval()

# # 3️⃣ Class labels
# class_labels = [
#     "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
#     "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
#     "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight",
#     "Corn_(maize)___healthy", "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
#     "Grape___healthy", "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
#     "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight", "Potato___Late_blight",
#     "Potato___healthy", "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew", "Strawberry___Leaf_scorch",
#     "Strawberry___healthy", "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
#     "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot",
#     "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
# ]

# # 4️⃣ Image preprocessing
# transform = transforms.Compose([
#     transforms.Resize((256, 256)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
# ])

# # 5️⃣ Prediction function
# def predict_image(image_path, model=model, transform=transform, labels=class_labels):
#     image = Image.open(image_path).convert('RGB')
#     img_t = transform(image)
#     batch_t = torch.unsqueeze(img_t, 0)
#     with torch.no_grad():
#         outputs = model(batch_t)
#         _, predicted = torch.max(outputs, 1)
#         return labels[predicted.item()]




# import os
# import torch
# from test_model_classes import ResNet9
# import torch.serialization
# import torch.nn.modules.container  # For nn.Sequential in ResNet9

# model_path = os.path.join(os.path.dirname(__file__), 'model', 'plant-disease-model-weights.pth')

# # Allowlist your custom ResNet9 and nn.Sequential for safe deserialization
# torch.serialization.add_safe_globals([
#     ResNet9,
#     torch.nn.modules.container.Sequential
# ])

# # Load the full model checkpoint, disabling weights_only check
# model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)
# model.eval()

# # Your class labels (put your full list here)
# class_labels = [
#     "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
#     "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
#     "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight",
#     "Corn_(maize)___healthy", "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
#     "Grape___healthy", "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
#     "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight", "Potato___Late_blight",
#     "Potato___healthy", "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew", "Strawberry___Leaf_scorch",
#     "Strawberry___healthy", "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
#     "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot",
#     "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
# ]

# from torchvision import transforms
# from PIL import Image

# transform = transforms.Compose([
#     transforms.Resize((256, 256)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406],
#                          std=[0.229, 0.224, 0.225]),
# ])

# def predict_image(image_path, model=model, transform=transform, labels=class_labels):
#     image = Image.open(image_path).convert('RGB')
#     img_t = transform(image)
#     batch_t = torch.unsqueeze(img_t, 0)
#     model.eval()
#     with torch.no_grad():
#         outputs = model(batch_t)
#         _, predicted = torch.max(outputs, 1)
#     return labels[predicted.item()]



# import torch
# import torch.nn as nn
# import torch.nn.functional as F
# from torchvision import transforms
# from PIL import Image
# import os

# # Convolution block
# def ConvBlock(in_channels, out_channels, pool=False):
#     layers = [nn.Conv2d(in_channels , out_channels , kernel_size=3, padding=1),
#               nn.BatchNorm2d(out_channels),
#               nn.ReLU(inplace=True)]
#     if pool:
#         layers.append(nn.MaxPool2d(4))
#     return nn.Sequential(*layers)

# # ResNet9 model
# class ResNet9(nn.Module):
#     def __init__(self, in_channels, num_classes):
#         super().__init__()
#         self.conv1 = ConvBlock(in_channels, 64)
#         self.conv2 = ConvBlock(64, 128, pool=True)
#         self.res1 = nn.Sequential(ConvBlock(128, 128), ConvBlock(128, 128))
#         self.conv3 = ConvBlock(128, 256, pool=True)
#         self.conv4 = ConvBlock(256, 512, pool=True)
#         self.res2 = nn.Sequential(ConvBlock(512, 512), ConvBlock(512, 512))
#         self.classifier = nn.Sequential(nn.MaxPool2d(4),
#                                         nn.Flatten(),
#                                         nn.Linear(512, num_classes))
        
#     def forward(self, xb):
#         out = self.conv1(xb)
#         out = self.conv2(out)
#         out = self.res1(out) + out
#         out = self.conv3(out)
#         out = self.conv4(out)
#         out = self.res2(out) + out
#         out = self.classifier(out)
#         return out

# # Model path
# model_path = os.path.join(os.path.dirname(__file__), 'model', 'plant-disease-model-complete.pth')

# # Number of classes
# num_classes = 38
# model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)

# # Instantiate model and load weights
# # model = ResNet9(3, num_classes)
# # state_dict = torch.load(model_path)
# # model.load_state_dict(state_dict)
# model.eval()

# # Class labels
# # class_labels = [ ... your 38 labels here ... ]

# # Image preprocessing
# transform = transforms.Compose([
#     transforms.Resize((256, 256)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406],
#                          std=[0.229, 0.224, 0.225])
# ])

# # Prediction function
# def predict_image(image_path):
#     image = Image.open(image_path).convert('RGB')
#     img_t = transform(image)
#     batch_t = torch.unsqueeze(img_t, 0)
#     with torch.no_grad():
#         outputs = model(batch_t)
#         _, predicted = torch.max(outputs, 1)
#         return class_labels[predicted.item()]
