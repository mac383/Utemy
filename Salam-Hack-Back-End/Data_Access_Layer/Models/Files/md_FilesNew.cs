using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Files
{
    public class md_FilesNew
    {
       
        public int UserId { get; set; }
        public string FileName { get; set; }
        public string FileTitle { get; set; }
        public string FileURL { get; set; }
        public md_FilesNew(string fileName, string fileTitle, string fileURL, int userId)
        {
            UserId = userId;
            FileName = fileName;
            FileTitle = fileTitle;
            FileURL = fileURL;
        }
    }
}
