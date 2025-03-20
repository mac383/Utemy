using Data_Access_Layer.database;
using Data_Access_Layer.Models.Files;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Classes
{
    public class cls_Files_D
    {
        public static async Task<List<md_Files>?> GetByUserIdAsync(int UserId)
        {
            List<md_Files> files = new List<md_Files>();

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[Files_FUN_GetByUserId] (@UserId)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = UserId });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                files.Add
                                    (
                                        new md_Files
                                        (
                                            reader.GetString(reader.GetOrdinal("FileName")),
                                            reader.GetString(reader.GetOrdinal("FileTitle")),
                                            reader.GetString(reader.GetOrdinal("FileURL")),
                                            reader.GetInt32(reader.GetOrdinal("UserId")),
                                            reader.GetInt32(reader.GetOrdinal("FileId"))                                          
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

            return files.Count > 0 ? files : null;
        }
       
        public static async Task<md_Files?> GetByFileIdAsync(int FileId)
        {
           md_Files file = new md_Files();

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[Files_FUN_GetByFileId] (@FileId)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@FileId", SqlDbType.Int) { Value = FileId });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                file.FileTitle =  reader.GetString(reader.GetOrdinal("FileTitle"));
                                file.FileURL = reader.GetString(reader.GetOrdinal("FileURL"));
                                file.UserId = reader.GetInt32(reader.GetOrdinal("UserId"));
                                file.FileId = FileId;                                  
                            }
                        }
                    }
                }
            }
            catch
            {
                return null;
            }

            return file.FileId != -1 ? file : null;
        }
        
        public static async Task<int> NewFileAsync(md_FilesNew file)
        {
            int insertedId = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Files_SP_New]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@FileTitle", SqlDbType.NVarChar, 150) { Value = file.FileTitle });
                        command.Parameters.Add(new SqlParameter("@FileURL", SqlDbType.NVarChar) { Value = file.FileURL });
                        command.Parameters.Add(new SqlParameter("@FileName", SqlDbType.NVarChar, 150) { Value = file.FileName });
                        command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = file.UserId });

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
        
        public static async Task<bool> UpdateFileAsync(md_FileUpdate file)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Files_SP_Update]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@FileId", SqlDbType.Int) { Value = file.FileId });
                        command.Parameters.Add(new SqlParameter("@FileTitle", SqlDbType.NVarChar, 150) { Value = file.FileTitle });
                        command.Parameters.Add(new SqlParameter("@FileURL", SqlDbType.NVarChar) { Value = file.FileURL });
                        command.Parameters.Add(new SqlParameter("@FileName", SqlDbType.NVarChar, 150) { Value = file.FileName });
                        command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = file.UserId });

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
        
        public static async Task<bool> DeleteFileAsync(int fileId)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Files_SP_DeleteFile]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@FileId", SqlDbType.Int) { Value = fileId });

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
