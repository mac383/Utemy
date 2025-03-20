using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Files
{
    public class md_FileUpdate
    {
        public int FileId { get; set; }
        public int UserId { get; set; }
        public string FileName { get; set; }
        public string FileTitle { get; set; }
        public string FileURL { get; set; }
        public md_FileUpdate(int fileId, string fileName, string fileTitle, string fileURL, int userId)
        {
            FileId = fileId;
            UserId = userId;
            FileName = fileName;
            FileTitle = fileTitle;
            FileURL = fileURL;
        }
    }
}
