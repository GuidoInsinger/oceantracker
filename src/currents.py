import numpy as np
import openmeteo_requests  # type: ignore
import requests_cache
from retry_requests import retry  # type: ignore

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession(".cache", expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)

openmeteo = openmeteo_requests.Client(session=retry_session)  # type: ignore

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below
url = "https://marine-api.open-meteo.com/v1/marine"


def new_ocean(lat: float, lon: float):
    params: dict[str, str | float | list[str]] = {
        "latitude": lat,
        "longitude": lon,
        "current": ["ocean_current_velocity", "ocean_current_direction"],
        "wind_speed_unit": "ms",
    }
    responses = openmeteo.weather_api(url, params=params)  # type: ignore

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]
    # print(f"Coordinates: {response.Latitude()}°N {response.Longitude()}°E")
    # print(f"Elevation: {response.Elevation()} m asl")
    # print(f"Timezone difference to GMT+0: {response.UtcOffsetSeconds()}s")

    # Process current data. The order of variables needs to be the same as requested.
    current = response.Current()
    current_ocean_current_velocity = current.Variables(0).Value()  # type: ignore
    current_ocean_current_direction = current.Variables(1).Value()  # type: ignore

    # print(f"\nCurrent time: {current.Time()}")  # type: ignore
    # print(f"Current ocean_current_velocity: {current_ocean_current_velocity}")
    # print(f"Current ocean_current_direction: {current_ocean_current_direction}")
    angle_radian = np.deg2rad(current_ocean_current_direction)

    velocity_vec = current_ocean_current_velocity * np.array(
        [np.cos(angle_radian), np.sin(angle_radian)]
    )
    return velocity_vec
