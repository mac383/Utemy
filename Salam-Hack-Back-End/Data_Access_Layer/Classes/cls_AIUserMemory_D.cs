using Data_Access_Layer.database;
using Data_Access_Layer.Models.AIUserMemory;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Classes
{
    public class cls_AIUserMemory_D
    {
        public static async Task<bool> UpdateUserMemoryAsync(md_UpdateUserMemory MemoryId)
        {

            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string procedureName = "[dbo].[AIUserMemory_SP_UpdateUserMemory]";

                    using (SqlCommand command = new SqlCommand(procedureName, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@MemoryId", SqlDbType.Int) { Value = MemoryId.MemoryId });
                        command.Parameters.Add(new SqlParameter("@RememberData", SqlDbType.NVarChar, 3000) { Value = MemoryId.RememberData });


                        SqlParameter returnParameter = command.Parameters.Add("returnValue", SqlDbType.Int);
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        rowsAffected = (int)returnParameter.Value;
                    }
                }
            }
            catch
            {
                return false;
            }

            return rowsAffected > 0;
        }

        public static async Task<md_UserMemory?> GetUserMemoryByUserIdAsync(int userId)
        {
            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = "SELECT * FROM [dbo].[AIUserMemory_FUN_GetUserMemoryByUserId](@UserId)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = userId });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                return new md_UserMemory
                                (
                                    reader.GetInt32(reader.GetOrdinal("MemoryId")),
                                    reader.GetString(reader.GetOrdinal("RememberData")),
                                    reader.GetDateTime(reader.GetOrdinal("LastUpdated"))
                                );
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }

            return null; // إذا لم يتم العثور على ذاكرة
        }
    }
}
