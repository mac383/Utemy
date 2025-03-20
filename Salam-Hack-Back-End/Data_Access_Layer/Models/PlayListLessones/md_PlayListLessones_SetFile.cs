using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.PlayListLessones
{
    public class md_PlayListLessones_SetFile
    {
        public int LessonId { get; set; }

        public string FileTitle { get; set; }
        public string FileURL { get; set; }
        public string FileName { get; set; }
        public md_PlayListLessones_SetFile( string fileTitle, string fileURL, string fileName, int lessonId)
        {
          
            FileTitle = fileTitle;
            FileURL = fileURL;
            FileName = fileName;
            LessonId = lessonId;
        }
    }
}
