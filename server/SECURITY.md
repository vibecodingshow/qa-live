# Security Implementation

## Overview
This document outlines the security improvements implemented in the Q&A Live application to address authentication and authorization concerns.

## Security Features Implemented

### 1. Password Hashing
- **Technology**: bcryptjs with 12 salt rounds
- **Location**: `src/utils/passwordUtils.ts`
- **Purpose**: Passwords are now hashed before storage and compared securely during authentication

### 2. JWT Token Authentication
- **Technology**: jsonwebtoken
- **Location**: `src/utils/jwtUtils.ts`
- **Purpose**: Secure session management with stateless authentication
- **Token Expiry**: 24 hours

### 3. Rate Limiting
- **Login Endpoint**: 5 attempts per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per IP
- **Technology**: express-rate-limit

### 4. Protected Routes
- **Authentication Required**: 
  - `POST /questions` - Create new questions
  - `PUT /questions/:id` - Update questions
  - `GET /profile` - User profile (example protected route)
- **Public Routes**:
  - `GET /questions` - View questions
  - `GET /speakers` - View speakers
  - `POST /login` - Authentication
  - `POST /logout` - Logout

## API Changes

### Login Response
```json
{
  "success": true,
  "user": {
    "id": "1",
    "username": "drsmith",
    "name": "Dr. Smith"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Authentication Header
For protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables
Create a `.env` file in the server directory:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
LOG_LEVEL=INFO
```

## Security Best Practices

### 1. Password Security
- Passwords are hashed using bcrypt with 12 salt rounds
- Original passwords are never stored in plain text
- Password comparison is done securely using bcrypt.compare()

### 2. Token Security
- JWT tokens are signed with a secret key
- Tokens expire after 24 hours
- Tokens should be stored securely on the client side

### 3. Rate Limiting
- Prevents brute force attacks on login endpoint
- General rate limiting prevents API abuse
- IP-based limiting with configurable windows

### 4. Input Validation
- All inputs are validated and sanitized
- Proper error messages without information leakage
- Type checking for all request parameters

## Migration Notes

### Password Migration
The existing plain-text passwords have been automatically hashed using the script at `src/scripts/hashPasswords.ts`. A backup of the original file was created at `speakers.json.backup`.

### Breaking Changes
- Login endpoint now returns a JWT token
- Protected routes require authentication
- Rate limiting may affect high-frequency requests

## Testing Security

### Test Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"drsmith","password":"speaker123"}'
```

### Test Protected Route
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Security Considerations

### Production Deployment
1. Change the JWT_SECRET to a strong, random value
2. Use HTTPS in production
3. Consider implementing refresh tokens for longer sessions
4. Add CORS configuration for production domains
5. Implement proper logging and monitoring
6. Consider adding password complexity requirements
7. Implement account lockout after multiple failed attempts

### Additional Security Measures
- Consider implementing CSRF protection
- Add request validation middleware
- Implement proper error handling without information leakage
- Add security headers (helmet.js)
- Consider implementing API versioning
