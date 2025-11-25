import numpy as np
import numpy.typing as npt
import rerun as rr
import rerun.blueprint as rrb


def initialize_viewer():
    rr.init("rerun_example_map_view", spawn=True)
    rr.set_time("time", duration=0.0)

    # Create a map view to display the chart.
    blueprint = rrb.Blueprint(
        rrb.Horizontal(
            rrb.MapView(
                origin="map",
                name="MapView",
                zoom=16.0,
                background=rrb.MapProvider.OpenStreetMap,
            ),
            rrb.TextDocumentView(
                origin="logs",
            ),
            column_shares=[0.8, 0.2],
        ),
        # collapse_panels=True,
    )

    rr.send_blueprint(blueprint)


# def log_text(text: str):
#     rr.log(
#         "logs",
#         rr.TextDocument(text=text),
#         # media_type=rr.MediaType.MARKDOWN,
#     )


def log_points(
    ll_arr: npt.NDArray[np.float64],
    boat_arr: npt.NDArray[np.float64],
    drone_arr: npt.NDArray[np.float64],
    uncertainty: npt.NDArray[np.float64],
    time: float,
):
    rr.set_time("time", duration=time)
    # colours = np.ones((ll_arr.shape[0], 4), dtype=np.uint8) @ np.array(
    #     [255, 186, 186, 0.5], dtype=np.uint8
    # )
    colours = np.array([50, 86, 86]) * np.ones((ll_arr.shape[0], 3))
    colours[-1] = np.array([50, 186, 186])

    rr.log(
        "map/points",
        rr.GeoPoints(
            lat_lon=ll_arr,
            radii=uncertainty,
            colors=colours,
        ),
    )
    # print(ll_arr, boat_arr)

    rr.log(
        "map/boat",
        rr.GeoLineStrings(
            lat_lon=boat_arr,
            radii=30,
            colors=[0, 0, 255],
        ),
        # draworder=2,
    )
    rr.log(
        "map/drone",
        rr.GeoLineStrings(
            lat_lon=drone_arr,
            radii=30,
            colors=[0, 0, 0],
        ),
        # draworder=1,
    )
