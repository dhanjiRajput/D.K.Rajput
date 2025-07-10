
# API Documentation

## POST `/users/register`

Registers a new user in the system.

### Request Body

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

#### Field Requirements

- `fullname.firstname` (string, required): Minimum 3 characters.
- `fullname.lastname` (string, optional): Minimum 3 characters if provided.
- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.

### Responses

#### Success

- **Status Code:** `201 Created`
- **Body Example:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body Example:**

```json
{
  "errors": [
    {
      "msg": "First Name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

#### Email Already Registered

- **Status Code:** `409 Conflict`
- **Body Example:**

```json
{
  "message": "Email is already registered."
}
```

---

## POST `/users/login`

Authenticates a user and returns a JWT token.

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body Example:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body Example:**

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### User Not Found

- **Status Code:** `401 Unauthorized`
- **Body Example:**

```json
{
  "message": "User Not Found.."
}
```

#### Invalid Password

- **Status Code:** `401 Unauthorized`
- **Body Example:**

```json
{
  "message": "Invalid Password"
}
```

---

## GET `/users/profile`

Returns the authenticated user's profile information.

### Headers

- Requires authentication via JWT token in cookies or Authorization header.

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body Example:**

```json
{
  "_id": "user_id_here",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "socketId": null
}
```

#### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body Example:**

```json
{
  "message": "Authentication required"
}
```

---

## GET `/users/logout`

Logs out the authenticated user by clearing the authentication token and blacklisting it.

### Headers

- Requires authentication via JWT token in cookies or Authorization header.

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body Example:**

```json
{
  "message": "Logged Out.."
}
```

#### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body Example:**

```json
{
  "message": "Authentication required"
}
```

---

**Note:**  
- All endpoints that require authentication expect a valid JWT token in the `token` cookie or `Authorization` header.
- The password is never returned in