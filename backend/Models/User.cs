using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MaisonBlush.API.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [Required, MaxLength(20)]
        public string Role { get; set; } = "Customer"; // Customer or Admin
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public ICollection<Address> Addresses { get; set; } = new List<Address>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }

    public class Address
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        
        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [Required, MaxLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [Required, MaxLength(250)]
        public string Street { get; set; } = string.Empty;
        
        [Required, MaxLength(100)]
        public string City { get; set; } = string.Empty;
        
        [Required, MaxLength(100)]
        public string State { get; set; } = string.Empty;
        
        [Required, MaxLength(100)]
        public string Country { get; set; } = "India";
        
        [Required, MaxLength(20)]
        public string PostalCode { get; set; } = string.Empty;
        
        public bool IsDefault { get; set; } = false;
    }
}
