import numpy as np

from src.simulation import run_simulation

if __name__ == "__main__":
    # Example: Run simulation with hardcoded GPS coordinates
    target_pos_ll_start = np.array([47.2720592, -3.1994916])
    boat_pos_ll_start = np.array([47.2885966, -2.5367349])
    drone_pos_ll_start = np.array([47.2924802, -2.5420609])

    result = run_simulation(
        target_pos_ll_start=target_pos_ll_start,
        boat_pos_ll_start=boat_pos_ll_start,
        drone_pos_ll_start=drone_pos_ll_start,
        T=5400,
        dt=30.0,
        use_rerun=True,  # Use rerun for visualization
    )

    # Print some results
    sigma_history = np.array(result["sigma_history"])
    print(f"Uncertainty at step 33: {sigma_history[33]}")
    print(f"Uncertainty at step 75: {sigma_history[75]}")
