using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Messages
{
    public class md_NewMessage
    {
        public int ConversationId { get; set; }
        public string Request { get; set; }
        public string Response { get; set; }
        //public string Summary { get; set; }

        public md_NewMessage(int conversationId, string request, string response)
        {
            ConversationId = conversationId;
            Request = request;
            Response = response;
            //Summary = summary;
        }
    }
}
