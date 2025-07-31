import requests
import logging
from flask import current_app
from geopy.geocoders import Nominatim

logger = logging.getLogger(__name__)

# 🌍 Reverse geocoding using OpenStreetMap
def get_location_name(lat, lng):
    try:
        geolocator = Nominatim(user_agent="safeher-app")
        location = geolocator.reverse((lat, lng), timeout=10)
        return location.address if location else "Unknown location"
    except Exception as e:
        logger.error(f"Error getting location name: {str(e)}")
        return "Unknown location"

# 🚨 Send emergency alert via Fast2SMS
def send_emergency_alerts(user, lat, lng):
    location_name = get_location_name(lat, lng)
    google_maps_link = f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"

    message = (
        f"🚨 EMERGENCY ALERT!\n"
        f"{user.name} needs help at:\n{location_name}\n"
        f"Map: {google_maps_link}"
    )

    headers = {
        'authorization': current_app.config['FAST2SMS_API_KEY'],
        'Content-Type': 'application/json'
    }

    for contact in user.contacts:
        if contact.is_primary:
            try:
                payload = {
                    "route": "v3",
                    "sender_id": "TXTIND",
                    "message": message,
                    "language": "english",
                    "flash": 0,
                    "numbers": contact.phone
                }

                response = requests.post(
                    "https://www.fast2sms.com/dev/bulkV2",
                    json=payload,
                    headers=headers
                )

                if response.status_code == 200:
                    logger.info(f"✅ SMS sent to {contact.phone}")
                else:
                    logger.error(f"❌ Fast2SMS error: {response.text}")

            except Exception as e:
                logger.error(f"❌ Failed to send SMS to {contact.phone}: {str(e)}")

    return True

# 🔒 Log security-related events
def log_security_event(user_id, event_details):
    logger.info(f"[SECURITY EVENT] User: {user_id}, Details: {event_details}")
