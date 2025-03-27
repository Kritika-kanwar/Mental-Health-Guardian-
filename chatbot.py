from flask import Flask, request, jsonify
from gpt4all import GPT4All

app = Flask(__name__)
model = GPT4All("mistral")  # Make sure you downloaded this model

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    response = model.generate(user_input)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(port=8085)
