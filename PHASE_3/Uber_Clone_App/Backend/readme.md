
# API Documentation

---

## User Endpoints

### POST `/users/register`
**Description:** Registers a new user.

**Required Data:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Responses:**
- `201 Created`: Returns JWT token and user object.
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id_here",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```
- `400 Bad Request`: Validation errors.
- `409 Conflict`: Email already registered.

---

### POST `/users/login`
**Description:** Authenticates a user and returns a JWT token.

**Required Data:**
```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Responses:**
- `200 OK`: Returns JWT token and user object.
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id_here",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```
- `400 Bad Request`: Validation errors.
- `401 Unauthorized`: User not found or invalid password.

---

### GET `/users/profile`
**Description:** Returns the authenticated user's profile.

**Headers:** Requires JWT token in cookies or Authorization header.

**Responses:**
- `200 OK`: Returns user profile.
  ```json
  {
    "_id": "user_id_here",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
  ```
- `401 Unauthorized`: Authentication required.

---

### GET `/users/logout`
**Description:** Logs out the user and blacklists the token.

**Headers:** Requires JWT token in cookies or Authorization header.

**Responses:**
- `200 OK`: `{ "message": "Logged Out.." }`
- `401 Unauthorized`: Authentication required.

---

## Captain Endpoints

### POST `/captain/register`
**Description:** Registers a new captain (driver).

**Required Data:**
```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Responses:**
- `201 Created`: Returns JWT token and captain object.
  ```json
  {
    "token": "jwt_token_here",
    "captain": {
      "_id": "captain_id_here",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Smith"
      },
      "email": "jane.smith@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```
- `400 Bad Request`: Validation errors.
- `409 Conflict`: Email already registered.

---

### POST `/captain/login`
**Description:** Authenticates a captain and returns a JWT token.

**Required Data:**
```json
{
  "email": "jane.smith@example.com",
  "password": "yourpassword"
}
```

**Responses:**
- `200 OK`: Returns JWT token and captain object.
  ```json
  {
    "token": "jwt_token_here",
    "captain": {
      "_id": "captain_id_here",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Smith"
      },
      "email": "jane.smith@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```
- `400 Bad Request`: Validation errors.
- `401 Unauthorized`: Captain not found or invalid password.

---

### GET `/captain/profile`
**Description:** Returns the authenticated captain's profile.

**Headers:** Requires JWT token in cookies or Authorization header.

**Responses:**
- `200 OK`: Returns captain profile.
  ```json
  {
    "_id": "captain_id_here",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
  ```
- `401 Unauthorized`: Authentication required.

---

### GET `/captain/logout`
**Description:** Logs out the captain and blacklists the token.

**Headers:** Requires JWT token in cookies or Authorization header.

**Responses:**
- `200 OK`: `{ "message": "Logged Out.." }`
- `401 Unauthorized`: Authentication required.

---

## Ride Endpoints

### POST `/rides/create`
**Description:** Create a new ride request.

**Required Data:**
```json
{
  "pickup": "Pickup Location",
  "destination": "Dropoff Location",
  "vehicleType": "car"
}
```

**Headers:** Requires JWT token in cookies or Authorization header.

**Responses:**
- `201 Created`: Returns ride object.
  ```json
  {
    "_id": "ride_id_here",
    "user": "user_id_here",
    "pickup": "Pickup Location",
    "destination": "Dropoff Location",
    "vehicleType": "car",
    ...otherFields
  }
  ```
- `400 Bad Request`: Validation errors.

---

### GET `/rides/get-fare`
**Description:** Get fare estimate for a ride.

**Required Query Params:**
- `pickup`: Pickup location (string)
- `destination`: Dropoff location (string)

**Headers:** Requires JWT token in cookies or Authorization header.

**Responses:**
- `201 Created`: Returns fare object.
  ```json
  {
    "fare": 120,
    "distance": "5 km",
    "time": "15 min"
  }
  ```
- `400 Bad Request`: Validation errors.

---

## Map Endpoints

### GET `/maps/get-coordinates`
**Description:** Get coordinates for an address.

**Required Query Params:**
- `address`: Address string (min 3 characters)

**Headers:** Requires JWT token in cookies or Authorization header.

**Responses:**
- `200 OK`: Returns coordinates object.
  ```json
  {
    "lat": 23.0225,
    "lng": 72.5714
  }
  ```
- `400 Bad Request`: Validation errors.

---

### GET `/maps/get-distance-time`
**Description:** Get distance and time between two coordinates.

**Required Query Params:**
- `fromLat`, `fromLng`, `toLat`, `toLng`: All required (numbers)

**Headers:** Requires JWT token in cookies or Authorization header.

**Responses:**
- `200 OK`: Returns distance and time object.
  ```json
  {
    "distance": "5 km",
    "time": "15 min"
  }
  ```
- `400 Bad Request`: Validation errors.

---

### GET `/maps/get-suggestions`
**Description:** Get address suggestions for autocomplete.

**Required Query Params:**
- `query`: Input string (min 3 characters)

**Headers:** Requires JWT token in cookies or Authorization header.

**Responses:**
- `200 OK`: Returns array of suggestions.
  ```json
  [
    "Address 1",
    "Address 2"
  ]
  ```
- `400 Bad Request`: Validation errors.

---

**Note:**
- All endpoints that require authentication expect a valid JWT token in the `token` cookie or `Authorization` header.
- The password is never returned in any response.