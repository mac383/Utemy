using Api_Layer.Util;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.User
{
    public class md_User_New
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public List<string> Fileds { get; set; }
        public string ProfileImageURL { get; set; }
        public string ProfileImageName { get; set; }

        public md_User_New(string fullname, string email, string username, string password, string profileImageURL, string profileImageName, List<string> fileds)
        {
            FullName = fullname;
            Email = email;
            UserName = username;
            Password = password;
            Fileds = fileds;
            ProfileImageURL = profileImageURL;
            ProfileImageName = profileImageName;
        }

        public DataTable GetFiledsAsDataTable()
        {
            return cls_DataTable.ConvertToDataTable(Fileds);
        }
    }
}
