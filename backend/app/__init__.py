from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from app.config import Config
from app.middleware import SecurityHeadersMiddleware


db = SQLAlchemy()
migrate = Migrate()
limiter = Limiter(key_func=get_remote_address)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Sentry for error tracking
    if app.config['SENTRY_DSN']:
        sentry_sdk.init(
            dsn=app.config['SENTRY_DSN'],
            integrations=[FlaskIntegration()],
            traces_sample_rate=1.0
        )

    # Add security headers middleware
    app.wsgi_app = SecurityHeadersMiddleware(app.wsgi_app)

    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)


    from app.routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app