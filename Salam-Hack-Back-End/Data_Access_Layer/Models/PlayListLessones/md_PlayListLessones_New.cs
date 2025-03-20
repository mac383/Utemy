using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.PlayListLessones
{
    public class md_PlayListLessones_New
    {
        public string LessonTitle { get; set; }
        public string VideoURL { get; set; }
        public string VideoId { get; set; }
        public string LessonNote { get; set; }
        public bool IsCompleted { get; set; }
        public string FileTitle { get; set; }
        public string FileURL { get; set; }
        public string FileName { get; set; }
        public int PlaylistId { get; set; }




        public md_PlayListLessones_New(string lessonTitle, string videoURL, string videoId, string lessonNote,
                              bool isCompleted, string fileTitle, string fileURL, string fileName, int playlistId)
        {
            LessonTitle = lessonTitle;
            VideoURL = videoURL;
            VideoId = videoId;
            LessonNote = lessonNote;
            IsCompleted = isCompleted;
            FileTitle = fileTitle;
            FileURL = fileURL;
            FileName = fileName;
            PlaylistId = playlistId;
        }
    }
}
