class SecurityHeadersMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        def custom_start_response(status, headers, exc_info=None):
            # Add security headers
            headers.extend([
                ('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'"),
                ('X-Content-Type-Options', 'nosniff'),
                ('X-Frame-Options', 'DENY'),
                ('X-XSS-Protection', '1; mode=block'),
                ('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'),
                ('Referrer-Policy', 'strict-origin-when-cross-origin'),
                ('Feature-Policy', "geolocation 'self'; microphone 'none'; camera 'none'")
            ])
            return start_response(status, headers, exc_info)

        return self.app(environ, custom_start_response)