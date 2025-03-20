using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.User
{
    public class md_User_SetImge
    {
        public int UserId { get; set; }
        public string ImageURL { get; set; }
        public string ImageName { get; set; }

        md_User_SetImge(int userID, string imageURL, string imageName)
        {
            UserId = userID;
            ImageURL = imageURL;
            ImageName = imageName;
        }
    }
}
