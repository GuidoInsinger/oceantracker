import numpy as np
import numpy.typing as npt
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


def new_ocean(ll_arr: npt.NDArray[np.float64]):
    params: dict[str, str | float | list[str]] = {
        "latitude": ll_arr[0],
        "longitude": ll_arr[1],
        "current": ["ocean_current_velocity", "ocean_current_direction"],
        "wind_speed_unit": "ms",
    }
    responses = openmeteo.weather_api(url, params=params)  # type: ignore

    response = responses[0]
    current = response.Current()

    current_ocean_current_velocity = current.Variables(0).Value()  # type: ignore
    current_ocean_current_direction = current.Variables(1).Value()  # type: ignore

    angle_radian = np.deg2rad(current_ocean_current_direction)

    velocity_vec = current_ocean_current_velocity * np.array(
        [np.cos(angle_radian), np.sin(angle_radian)]
    )
    return velocity_vec
