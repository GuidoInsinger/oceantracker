from typing import Annotated, Literal

import numpy as np
import numpy.typing as npt


class EKF:
    def __init__(
        self,
        cov0: Annotated[npt.NDArray[np.float64], Literal["N", "N"]],
        Q: Annotated[npt.NDArray[np.float64], Literal["N", "N"]],
        R: Annotated[npt.NDArray[np.float64], Literal["M", "M"]],
    ) -> None:
        self.cov: Annotated[npt.NDArray[np.float64], Literal["N", "N"]] = cov0
        self.Q = Q
        self.R = R

    def predict(
        self,
        state: npt.NDArray[np.float64],
        ocean_velocity: npt.NDArray[np.float64],
        dt: float,
    ) -> npt.NDArray[np.float64]:
        # predict next state
        state_prior = state + ocean_velocity * dt

        F = np.eye(2)
        self.cov = F @ self.cov @ F.T + self.Q

        return state_prior

    def update(
        self,
        state_prior: npt.NDArray[np.float64],
        position_measurement: npt.NDArray[np.float64],
    ) -> npt.NDArray[np.float64]:
        H = np.eye(2)
        y_hat = position_measurement - state_prior
        cov_prior = np.copy(self.cov)

        S = H @ cov_prior @ H.T + self.R
        K = cov_prior @ H.T @ np.linalg.inv(S)

        state_new = state_prior + K @ y_hat
        self.cov = (np.eye(H.shape[1]) - K @ H) @ cov_prior

        return state_new
