using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Access_Layer.Models.Fields
{
    public class md_Fields
    {
        public string Name { get; set; }    
        public int Userid {  get; set; }
        public int Fieldsid {  get; set; }

        public md_Fields(string name, int userid, int fieldsid)
        {
            Name = name;
            Userid = userid;
            Fieldsid = fieldsid;
        }
    }
}
