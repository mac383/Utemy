using Data_Access_Layer.database;
using Data_Access_Layer.Models.AIConversations;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Classes
{
    public class cls_AiConversations_D
    {
        public static async Task<int> AddNewConversationAsync(int userId)
        {
            int conversationId = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[AIConversations_SP_New]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = userId });

                        SqlParameter returnParameter = command.Parameters.Add("returnValue", SqlDbType.Int);
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        conversationId = (int)returnParameter.Value;
                    }
                }
            }
            catch (Exception ex)
            {

                return -1;
            }

            return conversationId;
        }

        public static async Task<bool> UpdateConversationTitleAsync(int conversationId, string newTitle)
        {
            bool isSuccess = false;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[AIConversations_SP_UpdateTitle]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@ConversationId", SqlDbType.Int) { Value = conversationId });
                        command.Parameters.Add(new SqlParameter("@NewTitle", SqlDbType.NVarChar, 255) { Value = newTitle });

                        await connection.OpenAsync();

                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        isSuccess = rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {

                return false;
            }

            return isSuccess;
        }

        public static async Task<bool> DeleteConversationAsync(int conversationId)
        {
            bool isSuccess = false;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[AIConversations_SP_Delete]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@ConversationId", SqlDbType.Int) { Value = conversationId });

                        await connection.OpenAsync();

                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        isSuccess = rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {

                return false;
            }

            return isSuccess;
        }

        public static async Task<List<md_Conversations>?> GetAllConversationsAsync(int userId)
        {
            List<md_Conversations> conversations = new List<md_Conversations>();

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[AIConversations_FUN_GetAll](@UserId)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = userId });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                conversations.Add
                                (
                                    new md_Conversations
                                    (
                                        reader.GetInt32(reader.GetOrdinal("ConversationId")),
                                        reader.GetString(reader.GetOrdinal("Title")),
                                        reader.GetDateTime(reader.GetOrdinal("LastInteraction"))
                                    )
                                );
                            }
                        }
                    }
                }
            }
            catch
            {
                return null;
            }

            return conversations.Count > 0 ? conversations : null;
        }
    }
}
