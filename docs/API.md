# API Documentation

Base Endpoint: `/api/v1`

## Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-09-21T20:38:02.000Z",
    "environment": "development"
  }