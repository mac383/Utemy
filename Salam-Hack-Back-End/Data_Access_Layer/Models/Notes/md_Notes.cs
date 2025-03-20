using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Notes
{
    public class md_Notes
    {
        public int NoteId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
        public string Title { get; set; }
        public DateTime LastUpdate { get; set; }
        public md_Notes(string content, string title, DateTime lastUpdate, int userId, int Noteid)
        {
            this.NoteId = Noteid;
            UserId = userId;
            Content = content;
            Title = title;
            LastUpdate = lastUpdate;
        }

        public md_Notes() 
        {
            this.NoteId = -1;
            UserId = -1;
            Content = "";
            Title = "";
            LastUpdate = DateTime.Now;
        }
    }
}
