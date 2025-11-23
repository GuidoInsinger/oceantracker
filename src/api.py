from typing import Optional

import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.simulation import run_simulation

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationRequest(BaseModel):
    target_lat: float
    target_lon: float
    boat_lat: Optional[float] = 47.2885966
    boat_lon: Optional[float] = -2.5367349
    drone_lat: Optional[float] = 47.2924802
    drone_lon: Optional[float] = -2.5420609
    T: int = 5400  # Total simulation time in seconds
    dt: float = 30.0  # Time step in seconds


class SimulationResponse(BaseModel):
    target_ll_history: list[list[float]]
    boat_ll_history: list[list[float]]
    drone_ll_history: list[list[float]]
    sigma_history: list[float]


@app.post("/api/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest):
    """
    Run the ocean tracking simulation with the provided GPS coordinates.
    """
    target_pos = np.array([request.target_lat, request.target_lon])

    boat_pos = None
    if request.boat_lat is not None and request.boat_lon is not None:
        boat_pos = np.array([request.boat_lat, request.boat_lon])

    drone_pos = None
    if request.drone_lat is not None and request.drone_lon is not None:
        drone_pos = np.array([request.drone_lat, request.drone_lon])

    result = run_simulation(
        target_pos_ll_start=target_pos,
        boat_pos_ll_start=boat_pos,
        drone_pos_ll_start=drone_pos,
        T=request.T,
        dt=request.dt,
        use_rerun=True,
    )

    return SimulationResponse(**result)


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}
