using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MaisonBlush.API.Middleware
{
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // OWASP A05: Security Misconfiguration - Standard Hardened Security Headers
            var headers = context.Response.Headers;

            // 1. Prevent MIME-sniffing
            headers["X-Content-Type-Options"] = "nosniff";

            // 2. Prevent Clickjacking
            headers["X-Frame-Options"] = "SAMEORIGIN";

            // 3. Cross-Site Scripting (XSS) Protection Filter for legacy browsers
            headers["X-XSS-Protection"] = "1; mode=block";

            // 4. Strict Referrer Policy
            headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

            // 5. Restrict permissions for sensitive hardware features
            headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=(self)";

            // 6. Content Security Policy (CSP)
            headers["Content-Security-Policy"] = 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com data:; " +
                "img-src 'self' data: https:; " +
                "frame-src 'self' https://api.razorpay.com; " +
                "connect-src 'self' https://api.razorpay.com http://localhost:5000 http://localhost:5173;";

            await _next(context);
        }
    }
}
