using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.User
{
    public class md_User_SetEmail
    {
        public int Userid { get; set; }
        public string Email { get; set; }
        public md_User_SetEmail(int userId, string email)
        {
            Userid = userId;
            Email = email;
        }
    }
}
