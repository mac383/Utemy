using Data_Access_Layer.database;
using Data_Access_Layer.Models.Files;
using Data_Access_Layer.Models.Notes;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Classes
{
    public class cls_Notes_D
    {
        public static async Task<List<md_Notes>?> GetNotesByUserIdAsync(int UserId)
        {
            List<md_Notes> Notes = new List<md_Notes>();

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[Notes_FUN_GetByUserId] (@Userid)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@Userid", SqlDbType.Int) { Value = UserId });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                Notes.Add
                                    (
                                        new md_Notes
                                        (
                                             reader.GetString(reader.GetOrdinal("Content")),
                                             reader.GetString(reader.GetOrdinal("Title")),
                                             reader.GetDateTime(reader.GetOrdinal("LastUpdate")),
                                               UserId,
                                            reader.GetInt32(reader.GetOrdinal("NoteId"))

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

            return Notes.Count > 0 ? Notes : null;
        }

        public static async Task<md_Notes?> GetByNoteIdAsync(int NoteId)
        {
            md_Notes Note = new md_Notes();

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[Notes_FUN_GetByNoteId] (@Noteid)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@Noteid", SqlDbType.Int) { Value = NoteId });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {


                                Note.Content = reader.GetString(reader.GetOrdinal("Content"));
                                Note.LastUpdate = reader.GetDateTime(reader.GetOrdinal("LastUpdate"));
                                Note.Title = reader.GetString(reader.GetOrdinal("Title"));
                                Note.UserId = reader.GetInt32(reader.GetOrdinal("UserId"));
                                Note.NoteId = NoteId;


                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {

                return null;
            }

            return Note.NoteId != -1 ? Note : null;
        }
        
        public static async Task<int> NewAsync(md_NotesNew Note)
        {
            int insertedId = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Notes_SP_New]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@Content", SqlDbType.NVarChar, 500) { Value = Note.Content });
                        command.Parameters.Add(new SqlParameter("@Title", SqlDbType.NVarChar) { Value = Note.Title });
                        command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = Note.UserId });

                        SqlParameter returnParameter = command.Parameters.Add("returnValue", SqlDbType.Int);
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        insertedId = (int)returnParameter.Value;
                    }
                }
            }
            catch (Exception ex)
            {
               
                return -1;
            }

            return insertedId;
        }
        
        public static async Task<bool> UpdateNoteAsync(md_NoteUpdate Note)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Notes_SP_Update]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@NoteId", SqlDbType.Int) { Value = Note.NoteId });
                        command.Parameters.Add(new SqlParameter("@Title", SqlDbType.NVarChar, 500) { Value = Note.Title });
                        command.Parameters.Add(new SqlParameter("@Content", SqlDbType.NVarChar) { Value = Note.Content });

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
        
        public static async Task<bool> DeleteNoteAsync(int NoteId)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Notes_SP_DeleteNote]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@NoteId", SqlDbType.Int) { Value = NoteId });

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
    }
}
