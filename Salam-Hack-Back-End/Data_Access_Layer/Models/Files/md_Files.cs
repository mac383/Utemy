using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Files
{
    public class md_Files
    {
       public int FileId {  get; set; }
       public int UserId {  get; set; }
        public string FileName { get; set; }
        public string FileTitle { get; set; }
        public string FileURL { get; set; }
        public md_Files( string fileName, string fileTitle, string fileURL, int userId, int fileId)
        {
            FileId = fileId;
            UserId = userId;
            FileName = fileName;
            FileTitle = fileTitle;
            FileURL = fileURL;
        }
        public md_Files() 
        {
            FileId = -1;
            UserId = -1;
            FileName = "";
            FileTitle = "";
            FileURL = "";

        }
    }
}
