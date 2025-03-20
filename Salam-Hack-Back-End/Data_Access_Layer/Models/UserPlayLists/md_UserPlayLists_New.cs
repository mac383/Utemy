using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.UserPlayLists
{
    public class md_UserPlayLists_New
    {
        public int UserId { get; set; }
        public string PlaylistTitle { get; set; }
        public string PlaylistURL { get; set; }
        public string PlaylistId { get; set; }
        public string? CoverURL { get; set; }
        public DataTable? Lessons { get; set; }

        public md_UserPlayLists_New(int userId, string playlistTitle, string playlistURL, string playlistId, string? coverURL, DataTable? lessons)
        {
            UserId = userId;
            PlaylistTitle = playlistTitle;
            PlaylistURL = playlistURL;
            PlaylistId = playlistId;
            CoverURL = coverURL;
            Lessons = lessons;
        }
    }
}
