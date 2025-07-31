from cryptography.fernet import Fernet
from base64 import b64encode, b64decode
import hashlib
from app.config import Config

class SecurityUtils:
    @staticmethod
    def encrypt_data(data):
        cipher_suite = Fernet(Config.CRYPTO_KEY)
        if isinstance(data, str):
            data = data.encode()
        encrypted_data = cipher_suite.encrypt(data)
        return b64encode(encrypted_data).decode()

    @staticmethod
    def decrypt_data(encrypted_data):
        cipher_suite = Fernet(Config.CRYPTO_KEY)
        decrypted_data = cipher_suite.decrypt(b64decode(encrypted_data))
        return decrypted_data.decode()

    @staticmethod
    def hash_password(password):
        return hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            Config.SECRET_KEY.encode('utf-8'),
            100000
        ).hex()

    @staticmethod
    def verify_password(stored_password, provided_password):
        return stored_password == SecurityUtils.hash_password(provided_password)