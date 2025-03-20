using Data_Access_Layer.database;
using Data_Access_Layer.Models.Files;
using Data_Access_Layer.Models.Notes;
using Data_Access_Layer.Models.PlayListLessones;
using Data_Access_Layer.Models.User;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Classes
{
    public class cls_PlayListlessones_D
    {
        public static async Task<int> NewAsync(md_PlayListLessones_New user)
        {
            int insertedId = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[PlaylistLessons_SP_New]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@LessonTitle", SqlDbType.Int) { Value = user.LessonTitle });
                        command.Parameters.Add(new SqlParameter("@VideoURL", SqlDbType.NVarChar, 25) { Value = user.VideoURL });
                        command.Parameters.Add(new SqlParameter("@VideoId", SqlDbType.NVarChar, 150) { Value = user.VideoId });
                        command.Parameters.Add(new SqlParameter("@LessonNote", SqlDbType.NVarChar, 25) { Value = user.LessonNote });
                        command.Parameters.Add(new SqlParameter("@FileTitle", SqlDbType.NVarChar, 150) { Value = user.FileTitle });
                        command.Parameters.Add(new SqlParameter("@FileURL", SqlDbType.NVarChar) { Value = user.FileURL });
                        command.Parameters.Add(new SqlParameter("@IsCompleted", SqlDbType.Bit, 150) { Value = user.IsCompleted });
                        command.Parameters.Add(new SqlParameter("@FileName", SqlDbType.NVarChar, 150) { Value = user.FileName });
                        command.Parameters.Add(new SqlParameter("@PlaylistId", SqlDbType.Int, 150) { Value = user.PlaylistId });

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
        
        public static async Task<bool> DeleteLessonAsync(int LessonId)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[PlaylistLessons_SP_DeleteLesson]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@LessonId", SqlDbType.Int) { Value = LessonId });

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
        
        public static async Task<bool> DeleteFileAsync(int LessonId)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[PlaylistLessons_SP_DeleteFile]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@lessonId", SqlDbType.Int) { Value = LessonId });

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
        
        public static async Task<bool> DeleteNoteAsync(int LessonId)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[PlaylestLessons_SP_DeleteNote]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@lessonId", SqlDbType.Int) { Value = LessonId });

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
        
        public static async Task<bool> SetAsCompletedAsync(int LessonId)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[PlaylistLessons_SP_SetAsCompleted]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@lessonId", SqlDbType.Int) { Value = LessonId });

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
        
        public static async Task<bool> SetFileAsync(md_PlayListLessones_SetFile file)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[PlaylistLessons_SP_SetFile]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@lessonId", SqlDbType.Int) { Value = file.LessonId });
                        command.Parameters.Add(new SqlParameter("@fileTitle", SqlDbType.NVarChar, 250) { Value = file.FileTitle });
                        command.Parameters.Add(new SqlParameter("@fileURL", SqlDbType.NVarChar) { Value = file.FileURL });
                        command.Parameters.Add(new SqlParameter("@fileName", SqlDbType.NVarChar, 150) { Value = file.FileName });

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
        
        public static async Task<bool> SetNotesAsync(string Notes, int LessonId )
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[PlaylistLessons_SP_SetNote]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@lessonId", SqlDbType.Int) { Value = LessonId });
                        command.Parameters.Add(new SqlParameter("@note", SqlDbType.NVarChar, 250) { Value = Notes });
                        

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
        
        public static async Task<bool> UpdateAsync(md_PlaylistLessons lesson)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[PlaylistLessons_SP_Update]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@LessonId", SqlDbType.Int) { Value = lesson.LessonId });
                        command.Parameters.Add(new SqlParameter("@LessonTitle", SqlDbType.NVarChar, 500) { Value = lesson.LessonTitle });
                        command.Parameters.Add(new SqlParameter("@VideoURL", SqlDbType.NVarChar) { Value = lesson.VideoURL });
                        command.Parameters.Add(new SqlParameter("@VideoId", SqlDbType.NVarChar) { Value = lesson.VideoId });
                        command.Parameters.Add(new SqlParameter("@LessonNote", SqlDbType.NVarChar) { Value = lesson.LessonNote });
                        command.Parameters.Add(new SqlParameter("@IsCompleted", SqlDbType.Bit) { Value = lesson.IsCompleted });
                        command.Parameters.Add(new SqlParameter("@FileTitle", SqlDbType.NVarChar) { Value = lesson.FileTitle });
                        command.Parameters.Add(new SqlParameter("@FileURL", SqlDbType.NVarChar) { Value = lesson.FileURL });
                        command.Parameters.Add(new SqlParameter("@FileName", SqlDbType.NVarChar) { Value = lesson.FileName });
                        command.Parameters.Add(new SqlParameter("@PlaylistId", SqlDbType.NVarChar) { Value = lesson.PlaylistId });

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

            return (rowsAffected > 0);
        }

        public static async Task<md_PlayListLessones_GetById?> GetBylessonIdAsync(int lessonId)
        {

            md_PlayListLessones_GetById? lesson = null;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    

                    string query = @"SELECT * FROM [dbo].[PlaylistLessons_FUN_GetById] (@lessonId)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@lessonId", SqlDbType.Int) { Value = lessonId });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        { 
                            if (await reader.ReadAsync()) 
                            {
                                lesson = new md_PlayListLessones_GetById
                                (
                                    reader.GetString(reader.GetOrdinal("LessonTitle")),
                                    reader.GetString(reader.GetOrdinal("VideoURL")),
                                    reader.GetString(reader.GetOrdinal("VideoId")),
                                    reader.IsDBNull(reader.GetOrdinal("LessonNote")) ?
                                    "" : reader.GetString(reader.GetOrdinal("LessonNote")),

                                    reader.GetBoolean(reader.GetOrdinal("IsCompleted")),
                                    reader.IsDBNull(reader.GetOrdinal("FileTitle")) ?
                                    "" : reader.GetString(reader.GetOrdinal("FileTitle")),
                                    reader.IsDBNull(reader.GetOrdinal("FileURL")) ?
                                    "" : reader.GetString(reader.GetOrdinal("FileURL")),
                                    reader.IsDBNull(reader.GetOrdinal("FileName")) ?
                                    "" : reader.GetString(reader.GetOrdinal("FileName")),
                                    lessonId
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

            return lesson.LessonId != -1 ? lesson : null;
        }

        public static async Task<List<md_PlayListLessones_GetByPlayListId>?> GetPlayListsByIDAsync(int PlaylistId)
        {
            List<md_PlayListLessones_GetByPlayListId> files = new List<md_PlayListLessones_GetByPlayListId>();

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[PlaylistLessons_FUN_GetByPlaylistId] (@PlaylistId)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@PlaylistId", SqlDbType.Int) { Value = PlaylistId });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                string lessonTitle = reader.IsDBNull(reader.GetOrdinal("LessonTitle")) ? string.Empty : reader.GetString(reader.GetOrdinal("LessonTitle"));
                                string? lessonNote = reader.IsDBNull(reader.GetOrdinal("LessonNote")) ? null : reader.GetString(reader.GetOrdinal("LessonNote"));
                                bool isCompleted = reader.GetBoolean(reader.GetOrdinal("IsCompleted"));
                                int lessonId = reader.GetInt32(reader.GetOrdinal("LessonId"));

                                files.Add(new md_PlayListLessones_GetByPlayListId(lessonTitle, lessonNote, isCompleted, PlaylistId, lessonId));
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return files.Count > 0 ? files : null;
        }
    }
}
