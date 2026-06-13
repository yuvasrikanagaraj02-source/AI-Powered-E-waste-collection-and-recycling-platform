from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import json

app = Flask(__name__)

model = load_model(r"C:\Users\mlsur\Downloads\SMART VENDING\SMART VENDING\backend\models\model.h5")

with open(r"C:\Users\mlsur\Downloads\SMART VENDING\SMART VENDING\backend\models\labels.json") as f:
    labels = json.load(f)

def preprocess_image(image):

    image = image.resize((224,224))

    image = np.array(image)

    image = image / 255.0

    image = np.expand_dims(image, axis=0)

    return image


@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:

        return jsonify({
            "error":"No image uploaded"
        })

    file = request.files["image"]

    image = Image.open(file)

    processed = preprocess_image(image)

    prediction = model.predict(processed)

    class_index = np.argmax(prediction)

    confidence = float(np.max(prediction))

    result = {
        "category": labels[str(class_index)],
        "confidence": confidence
    }

    return jsonify(result)


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000
    )