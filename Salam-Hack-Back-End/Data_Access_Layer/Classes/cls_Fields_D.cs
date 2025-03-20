using Data_Access_Layer.database;
using Data_Access_Layer.Models.Fields;
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
    public class cls_Fields_D
    {
        public static async Task<List<md_Fields>?> GetByUserIDAsync(int UserId)
        {
            List<md_Fields> types = new List<md_Fields>();

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[Fields_FUN_GetByUserId] (@UserId)";

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
                                        new md_Fields
                                        (
                                             reader.GetString(reader.GetOrdinal("Name")),
                                            reader.GetInt32(reader.GetOrdinal("UserId")),
                                            reader.GetInt32(reader.GetOrdinal("FieldId"))
                                           
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

        public static async Task<bool> IsExistAsync(int Fieldid)
        {
            bool isExist = false;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Fields_SP_IsFieldExist]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@Fieldid", SqlDbType.Int, 25) { Value = Fieldid });

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
        
        public static async Task<bool> DeleteAsync(int Fieldid)
        {
            bool Delete = false;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Fields_SP_delete]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@Fieldid", SqlDbType.Int, 25) { Value = Fieldid });

                        SqlParameter returnParameter = command.Parameters.Add("returnValue", SqlDbType.Bit);
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        Delete = Convert.ToBoolean(returnParameter.Value);
                    }
                }
            }
            catch (Exception ex)
            {


                return false;
            }

            return Delete;
        }
        
        public static async Task<int> NewAsync(string Name,int Userid)
        {
            int insertedId = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Fields_SP_NewOnlyOne]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@FieldsNew", SqlDbType.NVarChar, 100) { Value = Name });
                       
                        command.Parameters.Add(new SqlParameter("@Userid", SqlDbType.Int) { Value =Userid });

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
    }
}
