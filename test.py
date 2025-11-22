import numpy as np

from src.currents import new_ocean
from src.kalman import KalmanFilter
from src.utils import vector_to_latlon_delta
from src.viz import initialize_viewer, log_point

if __name__ == "__main__":
    # lat, lon = 47.22286256029357, -2.3091830879039024
    initialize_viewer()

    ll_arr = np.array([47.2720592, -3.1994916])
    dt = 60  # seconds

    cov0 = np.eye(2) * 100
    Q = np.eye(2) * 10
    R = np.eye(2) * 10

    ekf = KalmanFilter(cov0, Q, R)

    for _ in range(1000):
        log_point(ll_arr)

        velocity_vec = 60 * new_ocean(ll_arr)
        del_ll = vector_to_latlon_delta(velocity_vec, ll_arr[0])
        # print(del_lat, del_lon)
        ll_arr += del_ll
