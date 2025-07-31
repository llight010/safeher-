from flask import Blueprint, request, jsonify, current_app
from app.models import User, Contact, Device, db
from app.utils import send_emergency_alerts, log_security_event
import jwt
from datetime import datetime
from functools import wraps

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "✅ SafeHer API is running."

# ---------------------- AUTH TOKEN VALIDATION ----------------------

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith("Bearer "):
            return jsonify({'error': 'Authorization token is missing or invalid'}), 401

        try:
            token = token.split(" ")[1]
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['id'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# ---------------------- AUTH ROUTES ----------------------

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(field in data for field in ['name', 'email', 'phone', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409

    user = User(name=data['name'], email=data['email'], phone=data['phone'])
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    token = user.generate_auth_token()
    return jsonify({'token': token, 'user': user.to_dict()}), 201

@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    if not user or not user.check_password(data.get('password')):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = user.generate_auth_token()
    return jsonify({'token': token, 'user': user.to_dict()})

@main.route('/validate-token', methods=['GET'])
@token_required
def validate_token(current_user):
    return jsonify({'valid': True, 'user': current_user.to_dict()})

# ---------------------- CONTACT ROUTES ----------------------

@main.route('/contacts', methods=['GET'])
@token_required
def get_contacts(current_user):
    return jsonify([c.to_dict() for c in current_user.contacts])

@main.route('/contacts', methods=['POST'])
@token_required
def add_contact(current_user):
    data = request.get_json()
    if not all(field in data for field in ['name', 'phone']):
        return jsonify({'error': 'Name and phone are required'}), 400

    contact = Contact(
        name=data['name'],
        phone=data['phone'],
        email=data.get('email', ''),
        relationship=data.get('relationship', ''),
        is_primary=data.get('is_primary', False),
        user_id=current_user.id
    )

    db.session.add(contact)
    db.session.commit()
    return jsonify(contact.to_dict()), 201

@main.route('/contacts/<int:contact_id>', methods=['DELETE'])
@token_required
def delete_contact(current_user, contact_id):
    contact = Contact.query.filter_by(id=contact_id, user_id=current_user.id).first()
    if not contact:
        return jsonify({'error': 'Contact not found'}), 404

    db.session.delete(contact)
    db.session.commit()
    return jsonify({'message': 'Contact deleted successfully'}), 200

# ---------------------- EMERGENCY ROUTE ----------------------

@main.route('/emergency', methods=['POST'])
@token_required
def emergency(current_user):
    data = request.get_json()
    lat, lng = data.get('latitude'), data.get('longitude')

    if not lat or not lng:
        return jsonify({'error': 'Latitude and longitude are required'}), 400

    try:
        send_emergency_alerts(current_user, lat, lng)
        log_security_event(current_user.id, f"Emergency triggered at {lat}, {lng}")
        return jsonify({'message': '🚨 Emergency alert sent to contacts successfully.'}), 200
    except Exception as e:
        current_app.logger.error(f"Error sending emergency alert: {str(e)}")
        return jsonify({'error': 'Failed to send emergency alert'}), 500

# ---------------------- SAFETY TIPS ----------------------

@main.route('/safety-tips', methods=['GET'])
def safety_tips():
    tips = [
        {"id": 1, "title": "Trust your instincts", "content": "Leave if it feels unsafe."},
        {"id": 2, "title": "Use Fake Call", "content": "Exit awkward situations easily."},
        {"id": 3, "title": "Stay Connected", "content": "Keep your emergency contacts updated."}
    ]
    return jsonify(tips)
