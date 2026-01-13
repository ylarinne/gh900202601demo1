# Winter Holiday Activities

A full-stack web application for browsing and managing winter holiday activities with a RESTful API backend and responsive frontend.

## Features

- 🎿 Create and manage winter activities
- 📝 Comprehensive form for activity creation
- 🔍 Filter activities by snow requirement or price (free activities)
- 📱 Responsive design with Bootstrap CSS
- 🔄 Full CRUD operations via REST API
- 💾 MongoDB database integration
- 🎨 Beautiful form-based UI with validation

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **CORS** enabled for cross-origin requests

### Frontend
- **HTML5**
- **Bootstrap CSS** (via CDN)
- **Vanilla JavaScript** with Fetch API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ylarinne/gh900202601demo1.git
cd gh900202601demo1
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running locally:
```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod
```

## Usage

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000` and automatically seed the database with initial activities if empty.

### Development Mode

For auto-restart on file changes:
```bash
npm run dev
```

### Open the Frontend

Simply open `winter-activities.html` in your browser, or use a local server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js http-server (install globally first: npm install -g http-server)
http-server -p 8080
```

Then navigate to `http://localhost:8080/winter-activities.html`

## Winter Activities Form

The `winter-activities.html` file provides a standalone HTML form for creating new winter activities.

### Features
- Collects title, date, location, difficulty, duration, capacity, price, tags, description, and an optional image.
- By default the page serializes the form to JSON and sends a POST request to the API endpoint `/activities`.
- Image (if provided) is sent as base64 in `image_base64` with `image_name` and `image_type`. (This is simple but can produce large payloads; see backend recommendations.)
- Includes an alternative commented code snippet for sending `multipart/form-data` with a `FormData` object if your server prefers that.

### Running locally
You can open `winter-activities.html` directly in the browser, but for fetch requests to work (CORS / same-origin) you may want to serve the directory with a simple local server:

```bash
# from the repository root where winter-activities.html resides
python3 -m http.server 8000
# then open http://localhost:8000/winter-activities.html
```

### Changing the API endpoint
Edit the `API_ENDPOINT` constant near the top of the file's `<script>` block to point to your create-activity endpoint, for example:
```js
const API_ENDPOINT = '/api/activities'; // or 'https://api.example.com/activities'
```
If your backend only accepts `multipart/form-data`, use the commented `FormData` alternative inside the JS and remove the `Content-Type: application/json` header.

### Example curl (JSON)
If you want to test the same JSON shape from the command line (without image):

```bash
curl -X POST http://localhost:3000/activities \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Evening Ski Trip",
    "date":"2026-01-17",
    "location":"North Hill",
    "difficulty":"moderate",
    "duration_hours":3,
    "capacity":12,
    "price":20.00,
    "tags":["skiing","evening"],
    "description":"An evening group ski trip with lights.",
    "created_at":"2026-01-12T12:00:00Z"
  }'
```

### Backend recommendations for images
- Option A (recommended for production): accept multipart/form-data and store the binary file on disk or in object storage (S3). This avoids large JSON bodies and base64 overhead.
- Option B (simpler): accept base64 in `image_base64`. Decode and save, but watch memory limits and payload size constraints.
- Validate the image type (`image_type`) and size server-side.

### Notes / Caveats
- The HTML form ships with client-side validation, but you must also validate on the server.
- Base64 image encoding increases payload size by ~33%. For multiple/large images use multipart upload.
- Adjust the UI, fields names, or JSON shape to match your API schema.

## API Endpoints

### Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | Get all activities |
| GET | `/api/activities/:id` | Get activity by ID |
| POST | `/api/activities` | Create new activity |
| PUT | `/api/activities/:id` | Update activity |
| DELETE | `/api/activities/:id` | Delete activity |
| GET | `/api/activities/filter/snow/:required` | Filter by snow requirement (true/false) |
| GET | `/api/activities/filter/free` | Get free activities |

### Example Requests

**Create Activity:**
```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Snowmobiling",
    "price": 120,
    "isSnowNeeded": true
  }'
```

**Update Activity:**
```bash
curl -X PUT http://localhost:3000/api/activities/[ACTIVITY_ID] \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Skiing - Beginner",
    "price": 60,
    "isSnowNeeded": true
  }'
```

**Delete Activity:**
```bash
curl -X DELETE http://localhost:3000/api/activities/[ACTIVITY_ID]
```

## Database Schema

```javascript
{
  name: String (required),
  price: Number (required, min: 0),
  isSnowNeeded: Boolean (required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Project Structure

```
gh900202601demo1/
├── server.js                    # Express API server
├── package.json                 # Node.js dependencies
├── winter-activities.html       # Frontend application
├── hello.html                   # Demo HTML file
├── hello.js                     # Time calculation utilities
├── LICENSE                      # License file
└── README.md                    # This file
```

## Filter Functionality

The frontend includes four filter buttons:
- **All Activities** - Display all activities
- **❄️ Snow Required** - Show only activities requiring snow
- **✓ No Snow Needed** - Show activities without snow requirement
- **💰 Free Activities** - Display only free activities

## Initial Activities

The database is seeded with these activities on first run:
1. Skiing - $75 (snow required)
2. Snowboarding - $80 (snow required)
3. Ice Skating - $15 (no snow needed)
4. Sledding - $20 (snow required)
5. Snowshoeing - $30 (snow required)
6. Hot Chocolate Tour - $25 (no snow needed)
7. Winter Hiking - FREE (no snow needed)
8. Snowman Building - FREE (snow required)
9. Ice Fishing - $40 (no snow needed)
10. Dog Sledding - $150 (snow required)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Author

Created for GitHub Copilot training course (GH-900) - January 2026
