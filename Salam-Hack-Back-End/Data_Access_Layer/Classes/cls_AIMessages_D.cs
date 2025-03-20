using Data_Access_Layer.database;
using Data_Access_Layer.Models.Messages;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Classes
{
    public class cls_AIMessages_D
    {
        public static async Task<bool> HandleMessageAsync(md_NewMessage newMessage)
        {
            int returnValue = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string procedureName = @"[dbo].[AIMessages_SP_HandleMessage]";

                    using (SqlCommand command = new SqlCommand(procedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@ConversationId", SqlDbType.Int) { Value = newMessage.ConversationId });
                        command.Parameters.Add(new SqlParameter("@Request", SqlDbType.NVarChar) { Value = newMessage.Request });
                        command.Parameters.Add(new SqlParameter("@Response", SqlDbType.NVarChar) { Value = newMessage.Response });
                        //command.Parameters.Add(new SqlParameter("@Summary", SqlDbType.NVarChar) { Value = newMessage.Summary });

                        SqlParameter returnParameter = command.Parameters.Add("returnValue", SqlDbType.Int);
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();
                        returnValue = (int)returnParameter.Value;
                    }
                }
            }
            catch (Exception ex)
            {


                return false;
            }

            return returnValue > 0;
        }

        public static async Task<List<md_Messages>?> GetMessagesByConversationIdAsync(int conversationId)
        {
            List<md_Messages> messages = new List<md_Messages>();

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[AIMessages_FUN_GetByConversation](@ConversationId)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@ConversationId", SqlDbType.Int) { Value = conversationId });

                        await connection.OpenAsync();

                        using SqlDataReader reader = await command.ExecuteReaderAsync();
                        
                        while (await reader.ReadAsync())
                        {
                            messages.Add(new md_Messages
                            (
                                reader.GetInt32(reader.GetOrdinal("MessageId")),
                                reader.GetInt32(reader.GetOrdinal("ConversationId")),
                                reader.GetString(reader.GetOrdinal("Sender")),
                                reader.GetString(reader.GetOrdinal("Content")),
                                reader.GetDateTime(reader.GetOrdinal("SentAt"))
                            ));
                        }
                    }
                }
            }
            catch
            {
                return null;
            }

            return messages.Count > 0 ? messages : null;
        }
    }
}
