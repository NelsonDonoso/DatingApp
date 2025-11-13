using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public String DisplayName { get; set; } = "";
    
    [Required]
    [EmailAddress]
    public String Email { get; set; } = "";

    [Required]
    [MinLength(4)]
    public string Password { get; set; } = "";  
}
