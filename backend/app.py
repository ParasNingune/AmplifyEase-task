from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import Chatbot
import os

app = Flask(__name__)
CORS(app)

# Initialize chatbot
chatbot = Chatbot()

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Chatbot API is running'
    }), 200

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Handle chat messages
    Expected JSON: {
        "message": "user message",
        "session_id": "unique_session_id",
        "user_data": {}  # optional, collected user data
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'error': 'Message is required'
            }), 400
        
        user_message = data['message']
        session_id = data.get('session_id', 'default')
        user_data = data.get('user_data', {})
        
        # Get chatbot response
        response = chatbot.get_response(user_message, session_id, user_data)
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/reset', methods=['POST'])
def reset():
    """Reset conversation for a session"""
    try:
        data = request.get_json()
        session_id = data.get('session_id', 'default')
        chatbot.reset_session(session_id)
        
        return jsonify({
            'message': 'Session reset successfully'
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
