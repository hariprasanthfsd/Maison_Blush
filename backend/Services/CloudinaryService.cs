using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace MaisonBlush.API.Services
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(IFormFile file);
    }

    public class CloudinaryService : ICloudinaryService
    {
        private readonly IConfiguration _config;
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };
        private const long MaxFileSizeInBytes = 5 * 1024 * 1024; // 5 MB

        public CloudinaryService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80";
            }

            // OWASP A03 / A04: Validate file size
            if (file.Length > MaxFileSizeInBytes)
            {
                throw new ArgumentException("Uploaded image exceeds the maximum allowed size of 5 MB.");
            }

            // OWASP A03 / A04: Validate file extension
            var ext = Path.GetExtension(file.FileName)?.ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(ext) || !AllowedExtensions.Contains(ext))
            {
                throw new ArgumentException("Invalid file extension. Only JPG, PNG, and WEBP images are allowed.");
            }

            // OWASP A03 / A04: Validate MIME type (prevent SVG script injection and non-image payloads)
            var mime = file.ContentType?.ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(mime) || !AllowedMimeTypes.Contains(mime))
            {
                throw new ArgumentException("Invalid MIME content type. Only JPG, PNG, and WEBP images are permitted.");
            }

            // Read sanitized image into base64 data URI for safe storage
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            var fileBytes = ms.ToArray();
            var base64 = Convert.ToBase64String(fileBytes);
            return $"data:{mime};base64,{base64}";
        }
    }
}
