from src.currents import new_ocean
from src.utils import vector_to_latlon_delta
from src.viz import initialize_viewer, log_point

if __name__ == "__main__":
    # lat, lon = 47.22286256029357, -2.3091830879039024
    lat, lon = 47.2720592, -3.1994916
    initialize_viewer()
    ekf = 

    for _ in range(100):
        log_point(lat, lon)

        # velocity_vec = 100 * get_ocean_currents_openmeteo(lat, lon)  # assume is in kph?
        velocity_vec = 100 * new_ocean(lat, lon)
        del_lat, del_lon = vector_to_latlon_delta(velocity_vec, lat)
        # print(del_lat, del_lon)
        lat += del_lat
        lon += del_lon
