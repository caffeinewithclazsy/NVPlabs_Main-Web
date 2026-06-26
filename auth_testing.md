# Auth Testing Playbook

## MongoDB Verification
```
mongosh
use nvplabs_db
db.users.find({role: "admin"}).pretty()
```
- Verify bcrypt hash starts with `$2b$`
- Indexes: users.email (unique), login_attempts.identifier, password_reset_tokens.expires_at (TTL)

## API Testing
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"nvplabs@gmail.com","password":"NVPLabs@2025"}'
cat cookies.txt
curl -b cookies.txt http://localhost:8001/api/auth/me
```
Login returns user object and sets access_token + refresh_token cookies.
