using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.PlayListLessones
{
    public class md_PlayListLessones_GetByPlayListId
    {
        public int LessonId { get; set; }
        public string LessonTitle { get; set; }
       
        public string? LessonNote { get; set; }
        public bool IsCompleted { get; set; }
  
        public int PlaylistId { get; set; }




        public md_PlayListLessones_GetByPlayListId(string lessonTitle,  string? lessonNote,
                              bool isCompleted, int playlistId, int lessonid)
        {
            LessonTitle = lessonTitle;
            LessonNote = lessonNote;
            IsCompleted = isCompleted;
            PlaylistId = playlistId;
            LessonId = lessonid;
        }
    }
}
