import numpy as np
import numpy.typing as npt


def vector_to_latlon_delta(xy_vector: npt.NDArray[np.float64], lat: float):
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

    # Convert north component to delta latitude
    # 1 degree latitude = 111,320 meters (approximately constant)
    scale = np.array(
        [
            np.pi * EARTH_RADIUS / 180,
            (np.pi * EARTH_RADIUS / 180) * np.cos(np.radians(lat)),
        ]
    )

    delta_ll = xy_vector / scale
    return delta_ll
