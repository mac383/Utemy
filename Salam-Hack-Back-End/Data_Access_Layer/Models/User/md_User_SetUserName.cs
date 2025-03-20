using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.User
{
    public class md_User_SetUserName
    {
        public int Userid { get; set; }
        public string UserName { get; set; }

        public md_User_SetUserName(int userId, string userName)
        {
            Userid = userId;
            UserName = userName;
        }
    }
}
