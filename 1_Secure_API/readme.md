#  how to secure API and API data from server side in nodejs :
=====================================================================================

## (1). HTTPS (HyperText Transfer Protocol Secure):
- Use SSL/TLS (Transport Layer Security): to encrypt data in transit.
- For local dev, use tools like mkcert or https module with key/cert.
- For production, use Let's Encrypt or paid SSL certs.

## (2). Authentication (Who are you?)
- JWT (JSON Web Token)
- OAuth2 (e.g. Google, GitHub)
- Session-based auth (with cookies)

## (3). Authorization (Can you do this?)
- Role-based access control (RBAC): Admin, User, Guest

## (4). Input Validation & Sanitization
- Joi, zod, or express-validator to validate user input.
- Prevent SQL/NoSQL injection.

## (5). Rate Limiting
- Prevent brute-force or DDoS attacks.
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

## (6). Helmet for Secure Headers
- Helmet is a middleware package for Express.js that helps secure your app by setting various HTTP headers.
- By default, it sets 11 security headers.
    1. Content-Security-Policy (CSP) :- Prevents Cross-Site Scripting (XSS) and data injection attacks by controlling what resources (scripts, images, etc.) can be loaded
    2. X-Content-Type-Options :- Prevents the browser from MIME-sniffing a response away from the declared content-type.
    3. X-Frame-Options :- Protects against clickjacking by controlling whether the site can be rendered inside <iframe>.
    4. Strict-Transport-Security (HSTS) :-  Enforces HTTPS connections to your server — protects against protocol downgrade attacks.
    5. X-DNS-Prefetch-Control  :- Controls browser DNS prefetching (prevents privacy leaks).
    6. Referrer-Policy  :- Controls how much referrer information should be included with requests.
    7. X-Permitted-Cross-Domain-Policies :- Helps prevent Flash and PDF-based attacks.
    8. Cross-Origin-Embedder-Policy, Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy
      - These help protect against cross-origin data leaks.
      - Required for things like SharedArrayBuffers or secure iframes.

## (7). Use CORS Securely
- Allow only trusted origins:

## (8). Environment Variables

## (9). Database Security
- Sanitize input (prevent SQL/NoSQL injection).
- Use ORMs like Sequelize, Prisma, or Mongoose.
- Apply least privilege access for DB users.
- Use parameterized queries.

## (10). Logging & Monitoring
- Winston, Morgan for logs
- Monitor suspicious activity

## (11). Security Testing

## (12). Data Encryption (Optional but important)
- Encrypt sensitive fields before storing in DB (e.g., passwords, tokens)