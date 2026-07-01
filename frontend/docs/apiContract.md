# Backend API Contract

This document describes the expected backend API endpoints for the CYBERGUARD vulnerability scanner.

## Base URL

```
http://localhost:8001/api
```

## Authentication

All requests should include an API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### 1. Start Scan

Initiates a new vulnerability scan.

**Endpoint**: `POST /scan/start`

**Request Body**:
```json
{
  "url": "https://example.com",
  "scanType": "full",  // "quick" | "full" | "authenticated"
  "options": {
    "maxDepth": 3,
    "followRedirects": true,
    "timeout": 30000
  }
}
```

**Response** (201 Created):
```json
{
  "scanId": "scan_1234567890",
  "status": "queued",
  "targetUrl": "https://example.com",
  "scanType": "full",
  "estimatedDuration": 300,
  "startTime": "2025-07-15T10:30:00Z"
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Invalid URL",
  "message": "The provided URL is not accessible or is a private IP",
  "code": "INVALID_URL"
}
```

---

### 2. Check Scan Status

Retrieves the current status of a scan.

**Endpoint**: `GET /scan/{scanId}/status`

**Response** (200 OK):
```json
{
  "scanId": "scan_1234567890",
  "status": "scanning",  // "queued" | "scanning" | "completed" | "failed"
  "progress": 45,  // 0-100
  "currentPhase": "Testing authentication endpoints",
  "startTime": "2025-07-15T10:30:00Z",
  "estimatedCompletionTime": "2025-07-15T10:35:00Z"
}
```

---

### 3. Get Scan Results

Retrieves the complete results of a finished scan.

**Endpoint**: `GET /scan/{scanId}/results`

**Response** (200 OK):
```json
{
  "scanId": "scan_1234567890",
  "targetUrl": "https://example.com",
  "scanType": "full",
  "startTime": "2025-07-15T10:30:00Z",
  "endTime": "2025-07-15T10:35:42Z",
  "duration": 342,
  "totalFindings": 12,
  "riskScore": 78,
  "summary": {
    "critical": 2,
    "high": 3,
    "medium": 5,
    "low": 2,
    "info": 0
  },
  "vulnerabilities": [
    {
      "id": "vuln_001",
      "title": "SQL Injection in Login Form",
      "severity": "critical",
      "cvss": 9.8,
      "cve": ["CVE-2024-1234"],
      "description": "The login form is vulnerable to SQL injection attacks...",
      "affectedEndpoint": "/api/auth/login",
      "method": "POST",
      "parameter": "username",
      "exploitability": "High",
      "impact": "Complete database compromise, unauthorized access, data theft",
      "remediation": "Use parameterized queries or prepared statements...",
      "proofOfConcept": "POST /api/auth/login\nContent-Type: application/json\n\n{\"username\": \"admin' OR '1'='1\"}",
      "references": [
        "https://owasp.org/www-community/attacks/SQL_Injection"
      ],
      "timestamp": "2025-07-15T10:31:22Z"
    }
  ]
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Scan Not Found",
  "message": "No scan exists with the provided ID",
  "code": "SCAN_NOT_FOUND"
}
```

---

### 4. Stream Scan Logs (WebSocket)

Streams real-time scanning logs.

**Endpoint**: `WS /scan/{scanId}/logs`

**Message Format**:
```json
{
  "timestamp": "10:30:05",
  "message": "Starting port scan...",
  "type": "info"  // "info" | "success" | "warning" | "critical" | "high"
}
```

**Example Messages**:
```json
{"timestamp": "10:30:02", "message": "Initializing scan engine...", "type": "info"}
{"timestamp": "10:30:05", "message": "DNS resolved: 93.184.216.34", "type": "success"}
{"timestamp": "10:30:11", "message": "Missing security headers detected", "type": "warning"}
{"timestamp": "10:30:15", "message": "SQL injection vulnerability found!", "type": "critical"}
```

---

### 5. Export Report

Generates a downloadable report in various formats.

**Endpoint**: `GET /scan/{scanId}/export?format={format}`

**Query Parameters**:
- `format`: "json" | "pdf" | "html" | "csv"

**Response** (200 OK):
- Returns file download with appropriate `Content-Type` header
- JSON: `application/json`
- PDF: `application/pdf`
- HTML: `text/html`
- CSV: `text/csv`

---

### 6. List Recent Scans

Retrieves a list of recent scans for the authenticated user.

**Endpoint**: `GET /scans?limit={limit}&offset={offset}`

**Query Parameters**:
- `limit`: Number of results to return (default: 20, max: 100)
- `offset`: Number of results to skip (default: 0)

**Response** (200 OK):
```json
{
  "scans": [
    {
      "scanId": "scan_1234567890",
      "targetUrl": "https://example.com",
      "status": "completed",
      "riskScore": 78,
      "totalFindings": 12,
      "startTime": "2025-07-15T10:30:00Z",
      "endTime": "2025-07-15T10:35:42Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error Title",
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-07-15T10:30:00Z"
}
```

### Common Error Codes

- `INVALID_URL`: URL format is invalid or not accessible
- `PRIVATE_IP`: Attempted to scan a private IP or localhost
- `RATE_LIMIT_EXCEEDED`: Too many scan requests
- `SCAN_NOT_FOUND`: Scan ID does not exist
- `SCAN_IN_PROGRESS`: Cannot modify a running scan
- `UNAUTHORIZED`: Missing or invalid API key
- `QUOTA_EXCEEDED`: User has exceeded their scan quota

## Rate Limiting

The API implements rate limiting:

- **Scan Requests**: 10 per hour per user
- **Status Checks**: 60 per minute per user
- **Result Retrieval**: No limit

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1626350400
```

## CORS Configuration

The backend should allow requests from the frontend origin:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Security Headers

All responses should include security headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
```

---

## Integration Example

```javascript
import axios from 'axios';

const API = 'http://localhost:8001/api';
const API_KEY = 'your_api_key_here';

// Start a scan
const startScan = async (url, scanType) => {
  try {
    const response = await axios.post(
      `${API}/scan/start`,
      { url, scanType },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Scan failed:', error.response.data);
    throw error;
  }
};

// Check scan status
const checkStatus = async (scanId) => {
  const response = await axios.get(`${API}/scan/${scanId}/status`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  return response.data;
};

// Get results
const getResults = async (scanId) => {
  const response = await axios.get(`${API}/scan/${scanId}/results`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  return response.data;
};
```

---

**Note**: This is the expected backend contract. The frontend currently uses mock data for demonstration. Implement these endpoints on your backend to connect the full system.