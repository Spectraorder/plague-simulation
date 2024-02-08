from flask import Flask, render_template, request
import numpy as np
from scipy.integrate import odeint

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

@app.route("/simulate", methods=["GET", "POST"])
def simulate():
    if request.method == "POST":
        # Assuming form inputs are provided for these values
        N = int(request.form.get("population", 1000))
        I0 = int(request.form.get("infected", 1))
        R0 = int(request.form.get("recovered", 0))
        S0 = N - I0 - R0
        beta = float(request.form.get("beta", 0.2))
        gamma = float(request.form.get("gamma", 0.1))
        days = int(request.form.get("days", 160))
        
        t, S, I, R = simulate_sir_model(S0, I0, R0, beta, gamma, days)
        # Convert numpy arrays to lists for JSON compatibility
        results = {"t": t.tolist(), "S": S.tolist(), "I": I.tolist(), "R": R.tolist()}
        return render_template('simulation_results.html', results=results)
    else:
        return render_template('simulate.html')

if __name__ == "__main__":
    app.run(debug=True)
