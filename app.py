from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

def sir_model(S, I, R, a, b, dt, N):
    dSdt = -a * S * I / N
    dIdt = a * S * I / N - b * I
    dRdt = b * I
    S += dSdt * dt
    I += dIdt * dt
    R += dRdt * dt
    return S, I, R


def simulate_sir_model(S0, I0, R0, a, b, days, N, dt=1):
    t = np.arange(0, days, dt)
    S, I, R = np.zeros(len(t)), np.zeros(len(t)), np.zeros(len(t))
    S[0], I[0], R[0] = S0, I0, R0

    for i in range(1, len(t)):
        S[i], I[i], R[i] = sir_model(S[i - 1], I[i - 1], R[i - 1], a, b, dt, N)

    return t, S, I, R

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/start-simulation', methods=['POST'])
def start_simulation():
    data = request.json

    infectivity = data.get('infectivity')

    # airborne_rate = data.get('airborneRate')
    # mask_rate = data.get('maskRate')
    # activity_rate = data.get('activityRate')

    # print("Airborne Rate:", airborne_rate)
    # print("Mask Rate:", mask_rate)
    # print("Activity Rate:", activity_rate)

    # N = int(request.form.get("population", 1000))
    # I0 = int(request.form.get("infected", 1))
    # R0 = int(request.form.get("recovered", 0))
    # S0 = N - I0 - R0
    # a = float(request.form.get("a", 0.2))  # Infection rate 'a'
    # b = float(request.form.get("b", 0.1))  # Recovery rate 'b'
    # days = int(request.form.get("days", 160))

    # t, S, I, R = simulate_sir_model(S0, I0, R0, a, b, days, N)
    # # Convert numpy arrays to lists for JSON compatibility
    # results = {"t": t.tolist(), "S": S.tolist(), "I": I.tolist(), "R": R.tolist()}

    return jsonify({'message': 'Simulation started successfully.'}), 200


if __name__ == "__main__":
    app.run(debug=True)
