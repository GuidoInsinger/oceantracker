import numpy as np
import numpy.typing as npt


def vector_to_latlon_delta(vector: npt.NDArray[np.floating], lat: float):
    """
      Convert a vector to delta latitude and delta longitude.

      Parameters:
      -----------
      x_north : float
          X component pointing north (in distance units, e.g., meters)
      y_west : float
          Y component pointing west (in distance units, e.g., meters)
      lat : float
          Reference latitude in degrees (needed for longitude scaling)
    use distance_scale=1000

      Returns:
      --------
      delta_lat : float
          Change in latitude (degrees)
      delta_lon : float
          Change in longitude (degrees)

      Notes:
      ------
      - 1 degree latitude ≈ 111,320 meters (constant globally)
      - 1 degree longitude ≈ 111,320 * cos(latitude) meters
    """
    # Earth's radius in meters
    EARTH_RADIUS = 6371000  # meters

    # Convert to meters if needed
    x_north_m = vector[0]
    y_east_m = vector[1]

    # Convert north component to delta latitude
    # 1 degree latitude = 111,320 meters (approximately constant)
    meters_per_degree_lat = np.pi * EARTH_RADIUS / 180
    delta_lat = x_north_m / meters_per_degree_lat

    # Convert west component to delta longitude
    # 1 degree longitude varies with latitude: 111,320 * cos(lat) meters
    meters_per_degree_lon = (np.pi * EARTH_RADIUS / 180) * np.cos(np.radians(lat))

    # West is negative longitude change
    delta_lon = y_east_m / meters_per_degree_lon

    return delta_lat, delta_lon
