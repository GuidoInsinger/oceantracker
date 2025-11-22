import rerun as rr
import rerun.blueprint as rrb


def initialize_viewer():
    rr.init("rerun_example_map_view", spawn=True)

    # Create a map view to display the chart.
    blueprint = rrb.Blueprint(
        rrb.MapView(
            origin="points",
            name="MapView",
            zoom=16.0,
            background=rrb.MapProvider.OpenStreetMap,
        ),
        collapse_panels=True,
    )

    rr.send_blueprint(blueprint)


def log_point(lat: float, lon: float):
    rr.log(
        "points",
        rr.GeoPoints(
            lat_lon=[[lat, lon]],
            radii=rr.Radius.ui_points(5.0),
        ),
    )
