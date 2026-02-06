# Chatbot Widget - AmplifyEase

A beautiful, embeddable chatbot widget with clean UI/UX that can be integrated into any website.

## Features

- 🎨 **Modern UI/UX** - Clean, responsive design with smooth animations
- 💬 **Conversational Flow** - Natural conversation to collect user information
- 🎯 **Quick Replies** - Pre-defined button options for easy interaction
- 📱 **Responsive** - Works seamlessly on desktop and mobile
- 🔌 **Easy Integration** - Simple embed code for any website
- ⚡ **Real-time Responses** - Instant message delivery
- 🎭 **Typing Indicators** - Shows when bot is "thinking"

## Tech Stack

### Frontend
- **React** - Component-based UI framework
- **Vite** - Fast build tool and dev server
- **CSS Modules** - Scoped styling
- **Framer Motion** - Smooth animations

### Backend
- **Python Flask** - Lightweight web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-SocketIO** - Real-time communication (optional)

## Project Structure

```
AmplifyEase-task/
├── frontend/               # React chatbot widget
│   ├── public/
│   ├── src/
│   │   ├── components/    # Chatbot components
│   │   ├── styles/        # CSS modules
│   │   ├── utils/         # Helper functions
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/               # Flask API
│   ├── app.py            # Main Flask application
│   ├── chatbot.py        # Chatbot logic
│   └── requirements.txt
```

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The widget will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The API will run at `http://localhost:5001`

### Building for Production

```bash
cd frontend
npm install
```

This creates optimized files in `frontend/dist/` that can be embedded into any website.

## Embedding the Widget

Add this code to any HTML page:

```html
<!-- Load the chatbot widget -->
<link rel="stylesheet" href="https://your-domain.com/chatbot.css">
<div id="chatbot-widget"></div>
<script src="https://your-domain.com/chatbot.js"></script>
<script>
  ChatbotWidget.init({
    apiUrl: 'https://your-api.com',
    primaryColor: '#667eea',
    position: 'bottom-right'
  });
</script>
```

## Customization

The chatbot widget can be customized with various options:

```javascript
ChatbotWidget.init({
  apiUrl: 'http://localhost:5001',
  primaryColor: '#667eea',      // Main theme color
  position: 'bottom-right',      // 'bottom-right' or 'bottom-left'
  title: 'Chat with us!',        // Header title
  subtitle: 'We reply instantly', // Header subtitle
  placeholder: 'Type a message...', // Input placeholder
  welcomeMessage: 'Hi! How can I help you today?'
});
```

## API Endpoints

- `POST /api/chat` - Send message and get response
- `GET /api/health` - Health check endpoint