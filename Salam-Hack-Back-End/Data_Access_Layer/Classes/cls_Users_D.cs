using Data_Access_Layer.database;
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
    public class cls_Users_D
    {
        public static async Task<int> NewAsync(md_User_New user, DataTable filedsTable)
        {
            int insertedId = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_New]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@profileImageURL", SqlDbType.NVarChar) { Value = user.ProfileImageURL });
                        command.Parameters.Add(new SqlParameter("@fullName", SqlDbType.NVarChar, 25) { Value = user.FullName });
                        command.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar, 150) { Value = user.Email });
                        command.Parameters.Add(new SqlParameter("@userName", SqlDbType.NVarChar, 25) { Value = user.UserName });
                        command.Parameters.Add(new SqlParameter("@profileImageName", SqlDbType.NVarChar, 150) { Value = user.ProfileImageName });
                        command.Parameters.Add(new SqlParameter("@FieldsNew", SqlDbType.Structured) { Value = filedsTable });
                        command.Parameters.Add(new SqlParameter("@password", SqlDbType.NVarChar, 150) { Value = user.Password });

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

        public static async Task<bool> SetEmailAsync(md_User_SetEmail obj)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_SetEmail]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@userId", SqlDbType.Int) { Value = obj.Userid });
                        command.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar, 150) { Value = obj.Email });

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

        public static async Task<bool> SetFullNameAsync(md_User_SetFullName obj)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_SetFullName]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@userId", SqlDbType.Int) { Value = obj.Userid });
                        command.Parameters.Add(new SqlParameter("@fullName", SqlDbType.NVarChar, 25) { Value = obj.FullName });

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

        public static async Task<bool> SetImageAsync(md_User_SetImge obj)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_SetImage]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@userId", SqlDbType.Int) { Value = obj.UserId });
                        command.Parameters.Add(new SqlParameter("@imageURL", SqlDbType.NVarChar) { Value = obj.ImageURL });
                        command.Parameters.Add(new SqlParameter("@imageName", SqlDbType.NVarChar, 150) { Value = obj.ImageName });

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

        public static async Task<bool> SetPasswordAsync(md_User_SetPassword obj)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_SetPassword]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@userId", SqlDbType.Int) { Value = obj.Userid});
                        command.Parameters.Add(new SqlParameter("@password", SqlDbType.NVarChar, 150) { Value = obj.Password });

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

        public static async Task<bool> SetUserNameAsync(md_User_SetUserName obj)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_SetUserName]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@userId", SqlDbType.Int) { Value = obj.Userid });
                        command.Parameters.Add(new SqlParameter("@userName", SqlDbType.NVarChar, 25) { Value = obj.UserName });

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

        public static async Task<bool> IsEmailExistAsync(string email)
        {
            bool isExist = false;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_IsEmailExist]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar, 150) { Value = email });

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

        public static async Task<bool> IsImageNameExistAsync(string imageName)
        {
            bool isExist = false;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_IsImageNameExist]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@imageName", SqlDbType.NVarChar, 150) { Value = imageName });

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

        public static async Task<bool> IsUserNameExistAsync(string userName)
        {
            bool isExist = false;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_IsUserNameExist]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@userName", SqlDbType.NVarChar, 25) { Value = userName });

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

        public static async Task<md_UserAuth?> GetByAuthAsync(string userNameOrEmail, string password)
        {
            md_UserAuth? user = null;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"SELECT * FROM [dbo].[Users_FUN_GetByAuth] (@userNameOrEmail, @password)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add(new SqlParameter("@userNameOrEmail", SqlDbType.NVarChar, 150) { Value = userNameOrEmail });
                        command.Parameters.Add(new SqlParameter("@password", SqlDbType.NVarChar, 150) { Value = password });

                        await connection.OpenAsync();

                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                user = new md_UserAuth
                                    (
                                        reader.GetInt32(reader.GetOrdinal("UserId")),
                                        reader.GetString(reader.GetOrdinal("FullName")),
                                        reader.GetString(reader.GetOrdinal("UserName")),
                                        reader.GetString(reader.GetOrdinal("Email")),
                                        reader.GetString(reader.GetOrdinal("Password")),

                                        reader.IsDBNull(reader.GetOrdinal("ProfileImageURL")) ?
                                        null : reader.GetString(reader.GetOrdinal("ProfileImageURL")),

                                        reader.IsDBNull(reader.GetOrdinal("ProfileImageName")) ?
                                        null : reader.GetString(reader.GetOrdinal("ProfileImageName")),

                                        reader.GetDateTime(reader.GetOrdinal("RegistrationDate"))
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

            return user;
        }

        public static async Task<bool> DeleteImageAsync(int userId)
        {
            int rowsAffected = 0;

            try
            {
                using (SqlConnection connection = cls_database.Connection())
                {
                    string query = @"[dbo].[Users_SP_DeleteImage]";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new SqlParameter("@userId", SqlDbType.Int) { Value = userId });

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
    }
}
