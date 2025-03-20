using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;

namespace Data_Access_Layer.database
{
    public class cls_database
    {
        private static string? _connectionString;

        public static void InitializeDB(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Global");
        }

        public static SqlConnection Connection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
