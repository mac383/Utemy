using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Notes
{
    public class md_NotesNew
    {
        public int UserId { get; set; }
        public string Content { get; set; }
        public string Title { get; set; }


        public md_NotesNew(string content, string title, int userId)
        {
            UserId = userId;
            Content = content;
            Title = title;
        }
    }
}
