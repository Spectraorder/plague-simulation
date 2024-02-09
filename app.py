from flask import Flask, render_template, request, jsonify
from scipy.integrate import odeint

import numpy as np

app = Flask(__name__)

# The SIR model differential equations.
def sir_model(y, t, beta, gamma):
    S, I, R = y
    dSdt = -beta * S * I
    dIdt = beta * S * I - gamma * I
    dRdt = gamma * I
    return dSdt, dIdt, dRdt

def simulate_sir_model(S0, I0, R0, beta, gamma, days):
    # Initial number of infected and recovered individuals, everyone else is susceptible to infection initially.
    y0 = S0, I0, R0
    # A grid of time points (in days)
    t = np.linspace(0, days, days)
    # Integrate the SIR equations over the time grid, t.
    ret = odeint(sir_model, y0, t, args=(beta, gamma))
    S, I, R = ret.T
    return t, S, I, R

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
