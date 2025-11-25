import numpy as np
import numpy.typing as npt

from backend.currents import new_ocean
from backend.kalman import KalmanFilter
from backend.viz import initialize_viewer, log_points


def run_simulation(
    target_pos_ll_start: npt.NDArray[np.float64],
    boat_pos_ll_start: npt.NDArray[np.float64] | None = None,
    drone_pos_ll_start: npt.NDArray[np.float64] | None = None,
    T: int = 5400,
    dt: float = 30.0,
    boat_vel: float = 40 / 3.6,  # 40kmh
    drone_vel: float = 90 / 3.6,  # 90kmh
    use_rerun: bool = False,
):
    """
    Run the ocean tracking simulation.

    Args:
        target_pos_ll_start: Starting GPS coordinates [lat, lon] of the target (person in water)
        boat_pos_ll_start: Starting GPS coordinates [lat, lon] of the boat. If None, uses default offset.
        drone_pos_ll_start: Starting GPS coordinates [lat, lon] of the drone. If None, uses default offset.
        T: Total simulation time in seconds
        dt: Time step in seconds
        boat_vel: Boat velocity in m/s
        drone_vel: Drone velocity in m/s
        use_rerun: Whether to use rerun for visualization

    Returns:
        Dictionary containing simulation results:
        - target_ll_history: Array of target positions over time
        - boat_ll_history: Array of boat positions over time
        - drone_ll_history: Array of drone positions over time
        - sigma_history: Array of uncertainty values over time
    """
    if use_rerun:
        if initialize_viewer is None or log_points is None:
            raise ImportError(
                "rerun-sdk is required for visualization. Install it with: pip install rerun-sdk"
            )
        initialize_viewer()

    N_sim = int(T // dt)

    # Default positions relative to target if not provided
    if boat_pos_ll_start is None:
        # Default: boat starts ~50km away
        boat_pos_ll_start = target_pos_ll_start + np.array([0.01, 0.01])
    if drone_pos_ll_start is None:
        # Default: drone starts near boat
        drone_pos_ll_start = boat_pos_ll_start + np.array([0.001, 0.001])

    target_pos_ll_arr = np.copy(target_pos_ll_start)
    boat_pos_ll_arr = np.copy(boat_pos_ll_start)
    drone_pos_ll_arr = np.copy(drone_pos_ll_start)

    target_ll_history: npt.NDArray[np.float64] = np.zeros((N_sim, 2))
    sigma_history: npt.NDArray[np.float64] = np.zeros(N_sim)

    boat_ll_history: npt.NDArray[np.float64] = np.zeros((N_sim, 2))
    drone_ll_history: npt.NDArray[np.float64] = np.zeros((N_sim, 2))

    xy_arr = np.zeros(2)

    cov0 = np.eye(2) * 100**2
    Q = np.eye(2) * 20**2  # 10m per timestep
    R = np.eye(2) * 100

    kalman = KalmanFilter(cov0, Q, R)

    def get_scale(lat: float):
        EARTH_RADIUS = 6371000  # meters
        scale = np.array(
            [
                np.pi * EARTH_RADIUS / 180,
                (np.pi * EARTH_RADIUS / 180) * np.cos(np.radians(lat)),
            ]
        )
        return scale

    def track_target(
        target_pos_ll: npt.NDArray[np.float64],
        vehicle_pos_ll: npt.NDArray[np.float64],
        scale: npt.NDArray[np.float64],
        vehicle_vel: float,
        # logs: str,
        dt: float,
    ):
        vehicle_to_target_xy = (target_pos_ll - vehicle_pos_ll) * scale
        # if vehicle_vel < 50 / 3.6:
        #     logs += f"**BOAT DISTANCE**: {np.linalg.norm(vehicle_to_target_xy):.2f} meters \n"
        # else:
        #     logs += f"**DRONE DISTANCE**: {np.linalg.norm(vehicle_to_target_xy):.2f} meters \n"

        if np.linalg.norm(vehicle_to_target_xy) < 5000:
            vehicle_vel *= np.linalg.norm(vehicle_to_target_xy) / 5000.0  # type: ignore

        vehicle_velocity_vec_xy = (
            vehicle_vel * vehicle_to_target_xy / np.linalg.norm(vehicle_to_target_xy)
        )

        updated_vehicle_pos_ll = vehicle_pos_ll + vehicle_velocity_vec_xy / scale * dt
        return updated_vehicle_pos_ll

    for i in range(N_sim):
        # logs = f"## Logs at {(dt * (i + 1)) / 60} minutes \n"

        current_scale = get_scale(target_pos_ll_arr[0])

        # update target pos
        target_pos_ll_arr = target_pos_ll_start + xy_arr / current_scale
        target_ll_history[i] = target_pos_ll_arr
        sigma_history[i] = np.sqrt(kalman.cov[0, 0])

        # update boat pos
        if i * dt > 600:
            boat_pos_ll_arr = track_target(
                target_pos_ll_arr, boat_pos_ll_arr, current_scale, boat_vel, dt
            )
        boat_ll_history[i] = boat_pos_ll_arr

        # update drone pos
        drone_pos_ll_arr = track_target(
            target_pos_ll_arr, drone_pos_ll_arr, current_scale, drone_vel, dt
        )

        drone_ll_history[i] = drone_pos_ll_arr

        ocean_vel = new_ocean(target_pos_ll_arr)

        # ocean_vel = np.array([-1.0, 1.0]) + np.random.random(
        #     2
        # )  # 10 *
        xy_arr = kalman.predict(state=xy_arr, ocean_velocity=ocean_vel, dt=dt)

        if use_rerun and log_points is not None:
            log_points(
                target_ll_history[: i + 1],
                boat_ll_history[: i + 1],
                drone_ll_history[: i + 1],
                sigma_history[: i + 1],
                dt * (i + 1),
            )

    return {
        "target_ll_history": target_ll_history.tolist(),
        "boat_ll_history": boat_ll_history.tolist(),
        "drone_ll_history": drone_ll_history.tolist(),
        "sigma_history": sigma_history.tolist(),
    }
