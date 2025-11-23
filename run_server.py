#!/usr/bin/env python3
"""
Run the FastAPI backend server for the ocean tracker application.
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run("src.api:app", host="0.0.0.0", port=8000, reload=True)
