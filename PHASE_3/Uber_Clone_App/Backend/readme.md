# API Documentation

## User Endpoints

### POST `/users/register`

Registers a new user in the system.

#### Request Body

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

#### Responses

- **201 Created**  
  Returns JWT token and user object.
- **400 Bad Request**  
  Validation errors.
- **409 Conflict**  
  Email already registered.

---

### POST `/users/login`

Authenticates a user and returns a JWT token.

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Responses

- **200 OK**  
  Returns JWT token and user object.
- **400 Bad Request**  
  Validation errors.
- **401 Unauthorized**  
  User not found or invalid password.

---

### GET `/users/profile`

Returns the authenticated user's profile information.

#### Headers

- Requires authentication via JWT token in cookies or Authorization header.

#### Responses

- **200 OK**  
  Returns user profile.
- **401 Unauthorized**  
  Authentication required.

---

### GET `/users/logout`

Logs out the authenticated user by clearing and blacklisting the token.

#### Headers

- Requires authentication via JWT token in cookies or Authorization header.

#### Responses

- **200 OK**  
  `{ "message": "Logged Out.." }`
- **401 Unauthorized**  
  Authentication required.

---

## Captain Endpoints

### POST `/captain/register`

Registers a new captain (driver) in the system.

#### Request Body

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
    "vehicleType": "Sedan"
  }
}
```

#### Responses

- **201 Created**  
  Returns JWT token and captain object.
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
        "vehicleType": "Sedan"
      }
    }
  }
  ```
- **400 Bad Request**  
  Validation errors.
- **409 Conflict**  
  Email already registered.

---

### POST `/captain/login`

Authenticates a captain and returns a JWT token.

#### Request Body

```json
{
  "email": "jane.smith@example.com",
  "password": "yourpassword"
}
```

#### Responses

- **200 OK**  
  Returns JWT token and captain object.
- **400 Bad Request**  
  Validation errors.
- **401 Unauthorized**  
  Captain not found or invalid password.

---

### GET `/captain/profile`

Returns the authenticated captain's profile information.

#### Headers

- Requires authentication via JWT token in cookies or Authorization header.

#### Responses

- **200 OK**  
  Returns captain profile.
- **401 Unauthorized**  
  Authentication required.

---

### GET `/captain/logout`

Logs out the authenticated captain by clearing and blacklisting the token.

#### Headers

- Requires authentication via JWT token in cookies or Authorization header.

#### Responses

- **200 OK**  
  `{ "message": "Logged Out.." }`
- **401 Unauthorized**  
  Authentication required.

---

**Note:**  
- All endpoints that require authentication expect a valid JWT token in the `token` cookie or `Authorization` header.
- The password is never returned