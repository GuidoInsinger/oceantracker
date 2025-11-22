from typing import cast

import numpy as np
import numpy.typing as npt
import requests


def get_ocean_currents_openmeteo(lat: float, lon: float) -> npt.NDArray[np.floating]:
    """
    Get ocean current data for Saint-Nazaire using Open-Meteo Marine API
    """
    url = "https://marine-api.open-meteo.com/v1/marine"

    params: dict[str, str | float] = {
        "latitude": lat,
        "longitude": lon,
        "current": "ocean_current_velocity,ocean_current_direction",
        "timezone": "Europe/Paris",
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        current_data = data["current"]
        print(current_data)
        velocity = cast(float, current_data.get("ocean_current_velocity", [None]))
        direction = cast(float, current_data.get("ocean_current_direction", [None]))

        angle_radian = np.deg2rad(direction)

        velocity_vec = velocity * np.array([np.cos(angle_radian), np.sin(angle_radian)])

        return velocity_vec

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return np.array([0.0, 0.0])
