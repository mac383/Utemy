using Data_Access_Layer.database;
using Data_Access_Layer.Models.Fields;
using Data_Access_Layer.Models.User;
using Data_Access_Layer.Models.UserPlayLists;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Classes
{
    public class cls_UserPlayLists_D
    {
        public static async Task<bool> DeleteAsync(int PlayListId)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[UsersPlaylists_SP_DeleteList]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@ListId", SqlDbType.Int) { Value = PlayListId });

                        SqlParameter returnParameter = command.Parameters.Add("returnValue", SqlDbType.Int);
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        rowsAffected = (int)returnParameter.Value;
                    }
                }
            }
            catch (Exception ex)
            {

                return false;
            }

            return rowsAffected > 0;
        }
        
        public static async Task<bool> SetAsCompletedAsync(int PlayListId)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[UsersPlaylists_SP_SetCompletionRate]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@listId", SqlDbType.Int) { Value = PlayListId });

                        SqlParameter returnParameter = command.Parameters.Add("returnValue", SqlDbType.Int);
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        rowsAffected = (int)returnParameter.Value;
                    }
                }
            }
            catch (Exception ex)
            {

                return false;
            }

            return rowsAffected > 0;
        }
        
        public static async Task<bool> IsExistAsync(int PlayListId)
        {
            bool isExist = false;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[UsersPlaylists_SP_IsPlaylistExist]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@ListId", SqlDbType.Int, 25) { Value = PlayListId });

                        SqlParameter returnParameter = command.Parameters.Add("returnValue", SqlDbType.Bit);
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        isExist = Convert.ToBoolean(returnParameter.Value);
                    }
                }
            }
            catch (Exception ex)
            {


                return false;
            }

            return isExist;
        }

        public static async Task<int> NewAsync(md_UserPlayLists_New Playlist)
        {
            int insertedId = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[UsersPlaylists_SP_New]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@playlistTitle", SqlDbType.NVarChar) { Value = Playlist.PlaylistTitle });
                        command.Parameters.Add(new SqlParameter("@playlistURL", SqlDbType.NVarChar) { Value = Playlist.PlaylistURL });
                        command.Parameters.Add(new SqlParameter("@playlistId", SqlDbType.NVarChar) { Value = Playlist.PlaylistId });
                        command.Parameters.Add(new SqlParameter("@coverURL", SqlDbType.NVarChar) { Value = Playlist.CoverURL });
                        command.Parameters.Add(new SqlParameter("@userId", SqlDbType.Int) { Value = Playlist.UserId });
                        command.Parameters.Add(new SqlParameter("@lessons", SqlDbType.Structured) { Value = Playlist.Lessons });    

                        SqlParameter returnParameter = command.Parameters.Add("returnValue", SqlDbType.Int);
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        insertedId = (int)returnParameter.Value;
                    }
                }
            }
            catch
            {
                return -1;
            }

            return insertedId;
        }

        public static async Task<List<md_UserPlayLists_GetByUserId>?> GetByUserIDAsync(int UserId)
        {
            List<md_UserPlayLists_GetByUserId> types = new List<md_UserPlayLists_GetByUserId>();

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[UsersPlaylists_FUN_GetPlaylistsByUser] (@UserId)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                types.Add
                                    (
                                        new md_UserPlayLists_GetByUserId
                                        (
                                             reader.GetString(reader.GetOrdinal("PlaylistTitle")),
                                             reader.GetString(reader.GetOrdinal("PlaylistURL")),
                                             reader.GetString(reader.GetOrdinal("CoverURL")),
                                             reader.GetInt16(reader.GetOrdinal("CompletionRate")),
                                             reader.GetBoolean(reader.GetOrdinal("IsCompleted")),
                                             reader.GetInt32(reader.GetOrdinal("LessonsCount")),
                                             reader.GetInt32(reader.GetOrdinal("ListId"))
                                        )
                                    );
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {


                return null;
            }

            return types.Count > 0 ? types : null;
        }
    }
}
