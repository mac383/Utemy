using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Notes
{
    public class md_NoteUpdate
    {
        public int NoteId { get; set; }
        public string Content { get; set; }
        public string Title { get; set; }
        public md_NoteUpdate(string content, string title, int Noteid)
        {
            this.NoteId = Noteid;
            Content = content;
            Title = title;
        }

    }
}
