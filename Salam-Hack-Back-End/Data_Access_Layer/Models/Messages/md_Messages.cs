using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Messages
{
    public class md_Messages
    {
        public int MessageId { get; set; }
        public int ConversationId { get; set; }
        public string Sender { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }

        public md_Messages
            (
                int messageId, int conversationId, string sender,
                string content, DateTime sentAt
            )
        {
            MessageId = messageId;
            ConversationId = conversationId;
            Sender = sender;
            Content = content;
            SentAt = sentAt;
        }
    }
}
