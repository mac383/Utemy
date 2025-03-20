using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.UserPlayLists
{
    public class md_UserPlayLists_GetByUserId
    {
        public int ListId { get; set; }
        public string PlaylistTitle { get; set; }
        public string PlaylistURL { get; set; }
        public string CoverURL { get; set; }
        public int CompletionRate { get; set; }
        public bool IsCompleted { get; set; }
        public int LessonsCount { get; set; }

        public md_UserPlayLists_GetByUserId( string playlistTitle, string playlistURL,
                               string coverURL, int completionRate, bool isCompleted, int lessonsCount, int listId)
        {
            ListId = listId;
            PlaylistTitle = playlistTitle;
            PlaylistURL = playlistURL;
           
            CoverURL = coverURL;
            CompletionRate = completionRate;
            IsCompleted = isCompleted;
            LessonsCount = lessonsCount;
        }
    }
}
