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

    S0 = 990  # Initial susceptible population
    I0 = 10   # Initial infected population
    R0 = 0    # Initial recovered population
    infectivity = data.get('infectivity')
    try:
        infectivity = float(infectivity)
    except ValueError:
        return jsonify({'error': 'Invalid infectivity value. Must be a float.'}), 400
    recovery_rate = 0.02  # Recovery rate
    days = 100  # Total duration of simulation
    N = 1000  # Total population
    dt = 1  # Time step

    t, S, I, R = simulate_sir_model(S0, I0, R0, infectivity, recovery_rate, days, N, dt)

    simulation_results = {
        't': t.tolist(),
        'S': S.tolist(),
        'I': I.tolist(),
        'R': R.tolist(),
        'N': N
    }
    # print(I/N)

    return jsonify(simulation_results)


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")
