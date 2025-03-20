using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.AIUserMemory
{

    public class md_UpdateUserMemory
    {
        public int MemoryId { get; set; }
        public string RememberData { get; set; }

        public md_UpdateUserMemory(int memoryId, string rememberData)
        {
            MemoryId = memoryId;
            RememberData = rememberData;
        }
    }

}
