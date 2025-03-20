using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.User
{
    public class md_User_SetPassword
    {
        public int Userid { get; set; }
        public string Password { get; set; }
        public md_User_SetPassword(int userId, string password)
        {
            Userid = userId;
            Password = password;
        }

    }
}
