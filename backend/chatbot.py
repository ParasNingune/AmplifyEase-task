import re
from datetime import datetime

class Chatbot:
    """
    Chatbot logic with conversation flow and user data collection
    """
    
    def __init__(self):
        self.sessions = {}
        self.knowledge_base = {
            'pricing': 'Our pricing starts at $29/month for the basic plan, $79/month for professional, and $199/month for enterprise.',
            'features': 'We offer AI-powered responses, multi-channel support, analytics dashboard, custom branding, and 24/7 availability.',
            'support': 'Our support team is available 24/7 via chat, email, and phone. Enterprise customers get dedicated account managers.',
            'integration': 'We integrate with Slack, Zendesk, Salesforce, HubSpot, and many more platforms via our API.',
            'trial': 'Yes! We offer a 14-day free trial with full access to all features. No credit card required.',
            'demo': 'I\'d be happy to schedule a demo! Please provide your email and our team will reach out within 24 hours.',
        }
    
    def get_session(self, session_id):
        """Get or create session"""
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                'stage': 'greeting',
                'user_data': {},
                'history': []
            }
        return self.sessions[session_id]
    
    def reset_session(self, session_id):
        """Reset a conversation session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
    
    def get_response(self, message, session_id, user_data=None):
        """Generate chatbot response based on message and conversation stage"""
        session = self.get_session(session_id)
        
        # Update user data if provided
        if user_data:
            session['user_data'].update(user_data)
        
        # Add to history
        session['history'].append({
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
        message_lower = message.lower().strip()
        stage = session['stage']
        
        # Greeting stage
        if stage == 'greeting':
            if self._is_greeting(message_lower):
                session['stage'] = 'ask_name'
                return {
                    'message': 'Hello! 👋 I\'m here to help you. What\'s your name?',
                    'type': 'text',
                    'options': None
                }
            else:
                # User jumped straight to a question
                return self._handle_query(message_lower, session)
        
        # Collecting name
        elif stage == 'ask_name':
            session['user_data']['name'] = message
            session['stage'] = 'ask_help'
            return {
                'message': f'Nice to meet you, {message}! 😊\n\nHow can I help you today?',
                'type': 'buttons',
                'options': [
                    {'label': 'Product Info', 'value': 'product'},
                    {'label': 'Pricing', 'value': 'pricing'},
                    {'label': 'Schedule Demo', 'value': 'demo'},
                    {'label': 'Support', 'value': 'support'}
                ]
            }
        
        # Main conversation flow
        elif stage == 'ask_help':
            return self._handle_query(message_lower, session)
        
        # Collecting email
        elif stage == 'collect_email':
            if self._is_valid_email(message):
                session['user_data']['email'] = message
                session['stage'] = 'collect_phone'
                return {
                    'message': 'Great! And what\'s the best phone number to reach you?',
                    'type': 'text',
                    'options': [
                        {'label': 'Skip', 'value': 'skip'}
                    ]
                }
            else:
                return {
                    'message': 'That doesn\'t look like a valid email. Could you please provide a valid email address?',
                    'type': 'text',
                    'options': None
                }
        
        # Collecting phone
        elif stage == 'collect_phone':
            if message_lower == 'skip':
                session['user_data']['phone'] = 'Not provided'
            else:
                session['user_data']['phone'] = message
            
            session['stage'] = 'complete'
            name = session['user_data'].get('name', 'there')
            return {
                'message': f'Thank you, {name}! 🎉\n\nI\'ve collected your information:\n• Name: {session["user_data"]["name"]}\n• Email: {session["user_data"]["email"]}\n• Phone: {session["user_data"].get("phone", "Not provided")}\n\nOur team will reach out to you shortly. Is there anything else I can help you with?',
                'type': 'buttons',
                'options': [
                    {'label': 'Ask Another Question', 'value': 'question'},
                    {'label': 'End Chat', 'value': 'end'}
                ]
            }
        
        # Completed flow
        elif stage == 'complete':
            if message_lower in ['end', 'end chat', 'goodbye', 'bye']:
                self.reset_session(session_id)
                return {
                    'message': 'Thank you for chatting with us! Have a great day! 👋',
                    'type': 'text',
                    'options': None
                }
            else:
                session['stage'] = 'ask_help'
                return self._handle_query(message_lower, session)
        
        # Default
        return self._handle_query(message_lower, session)
    
    def _handle_query(self, message, session):
        """Handle specific queries"""
        
        # Check for greetings
        if self._is_greeting(message):
            return {
                'message': 'Hello! How can I assist you today?',
                'type': 'buttons',
                'options': [
                    {'label': 'Product Info', 'value': 'product'},
                    {'label': 'Pricing', 'value': 'pricing'},
                    {'label': 'Schedule Demo', 'value': 'demo'},
                    {'label': 'Support', 'value': 'support'}
                ]
            }
        
        # Pricing query
        if any(word in message for word in ['pricing', 'price', 'cost', 'plan']):
            return {
                'message': self.knowledge_base['pricing'] + '\n\nWould you like to try our free trial?',
                'type': 'buttons',
                'options': [
                    {'label': 'Yes, start trial', 'value': 'trial'},
                    {'label': 'Schedule demo', 'value': 'demo'},
                    {'label': 'Ask something else', 'value': 'question'}
                ]
            }
        
        # Features/Product query
        if any(word in message for word in ['feature', 'product', 'offer', 'what do you']):
            return {
                'message': self.knowledge_base['features'] + '\n\nWant to see it in action?',
                'type': 'buttons',
                'options': [
                    {'label': 'Schedule Demo', 'value': 'demo'},
                    {'label': 'Pricing Info', 'value': 'pricing'},
                    {'label': 'Start Free Trial', 'value': 'trial'}
                ]
            }
        
        # Support query
        if any(word in message for word in ['support', 'help', 'contact', 'reach']):
            return {
                'message': self.knowledge_base['support'] + '\n\nHow would you like to proceed?',
                'type': 'buttons',
                'options': [
                    {'label': 'Contact Support', 'value': 'demo'},
                    {'label': 'FAQs', 'value': 'faq'},
                    {'label': 'Ask Another Question', 'value': 'question'}
                ]
            }
        
        # Integration query
        if any(word in message for word in ['integration', 'integrate', 'api', 'connect']):
            return {
                'message': self.knowledge_base['integration'] + '\n\nWant to learn more?',
                'type': 'buttons',
                'options': [
                    {'label': 'View Documentation', 'value': 'docs'},
                    {'label': 'Schedule Demo', 'value': 'demo'},
                    {'label': 'Ask Another Question', 'value': 'question'}
                ]
            }
        
        # Demo/Trial request
        if any(word in message for word in ['demo', 'trial', 'try', 'test']):
            session['stage'] = 'collect_email'
            return {
                'message': 'Excellent! I\'d be happy to set that up for you. 🚀\n\nWhat\'s your email address?',
                'type': 'text',
                'options': None
            }
        
        # Thank you
        if any(word in message for word in ['thank', 'thanks', 'appreciate']):
            return {
                'message': 'You\'re welcome! Is there anything else I can help you with?',
                'type': 'buttons',
                'options': [
                    {'label': 'Yes', 'value': 'yes'},
                    {'label': 'No, thanks', 'value': 'end'}
                ]
            }
        
        # Goodbye
        if any(word in message for word in ['bye', 'goodbye', 'end', 'quit', 'exit']):
            return {
                'message': 'Thank you for chatting! Have a wonderful day! 👋',
                'type': 'text',
                'options': None
            }
        
        # Default response
        return {
            'message': 'I\'m not sure I understand. Let me help you with some common topics:',
            'type': 'buttons',
            'options': [
                {'label': 'Product Features', 'value': 'product'},
                {'label': 'Pricing Plans', 'value': 'pricing'},
                {'label': 'Schedule Demo', 'value': 'demo'},
                {'label': 'Contact Support', 'value': 'support'}
            ]
        }
    
    def _is_greeting(self, message):
        """Check if message is a greeting"""
        greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening']
        return any(greeting in message for greeting in greetings)
    
    def _is_valid_email(self, email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
