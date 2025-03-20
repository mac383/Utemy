using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.AIUserMemory
{
    public class md_UserMemory
    {
        public int MemoryId { get; set; }
        public string RememberData { get; set; }
        public DateTime LastUpdated { get; set; }

        public md_UserMemory(int memoryId, string rememberData, DateTime lastUpdated)
        {
            MemoryId = memoryId;
            RememberData = rememberData;
            LastUpdated = lastUpdated;
        }
    }
}
