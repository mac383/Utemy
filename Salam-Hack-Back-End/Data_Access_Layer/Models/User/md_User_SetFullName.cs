using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.User
{
    public class md_User_SetFullName
    {
        public int Userid { get; set; }
        public string FullName { get; set; }

        public md_User_SetFullName(int userid, string fullName)
        {
            Userid = userid;
            FullName = fullName;
        }
    }
}
