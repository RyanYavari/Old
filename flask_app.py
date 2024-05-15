from flask import Flask, request, jsonify
from PIL import Image
import io
import numpy as np
import tensorflow as tf

app = Flask(__name__)

# Load the model
model = tf.keras.models.load_model('mnist_model.h5')


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        img = Image.open(io.BytesIO(file.read())).convert('L')
        img = img.resize((28, 28))
        img_array = np.array(img) / 255.0
        img_array = img_array.reshape(1, 28, 28, 1)

        prediction = model.predict(img_array)
        predicted_number = np.argmax(prediction)

        return jsonify({'guess': int(predicted_number)})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
