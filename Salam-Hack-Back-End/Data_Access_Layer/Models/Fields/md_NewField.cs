using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Fields
{
    public class md_NewField
    {
        public string Name { get; set; }
        public int Userid { get; set; }
       

        public md_NewField(string name, int userid)
        {
            Name = name;
            Userid = userid;
        
        }
    }
}
