from app import db
from datetime import datetime
import jwt
from time import time
from app.security import SecurityUtils
from flask import current_app


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_verified = db.Column(db.Boolean, default=False)
    two_factor_enabled = db.Column(db.Boolean, default=False)

    contacts = db.relationship('Contact', backref='user', lazy=True, cascade='all, delete-orphan')
    devices = db.relationship('Device', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = SecurityUtils.hash_password(password)

    def check_password(self, password):
        return SecurityUtils.verify_password(self.password_hash, password)

    def generate_auth_token(self, expires_in=3600):
        return jwt.encode(
            {'id': self.id, 'exp': time() + expires_in},
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )

    @staticmethod
    def verify_auth_token(token):
        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        except:
            return None
        return User.query.get(data['id'])

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_verified': self.is_verified,
            'two_factor_enabled': self.two_factor_enabled
        }


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    relationship = db.Column(db.String(50))
    is_primary = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'relationship': self.relationship,
            'is_primary': self.is_primary
        }


class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(255), nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    os_version = db.Column(db.String(50))
    app_version = db.Column(db.String(50))
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'device_id': self.device_id,
            'device_type': self.device_type,
            'os_version': self.os_version,
            'app_version': self.app_version,
            'last_active': self.last_active.isoformat()
        }
