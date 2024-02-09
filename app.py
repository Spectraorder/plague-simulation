from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/start-simulation', methods=['POST'])
def start_simulation():
    data = request.json

    airborne_rate = data.get('airborneRate')
    mask_rate = data.get('maskRate')
    activity_rate = data.get('activityRate')

    # print("Airborne Rate:", airborne_rate)
    # print("Mask Rate:", mask_rate)
    # print("Activity Rate:", activity_rate)

    return jsonify({'message': 'Simulation started successfully.'}), 200


if __name__ == "__main__":
    app.run(debug=True)