using System.Data;

namespace Api_Layer.Util
{
    public class cls_DataTable
    {
        public static DataTable ConvertToDataTable(List<string> filedItems)
        {
            DataTable dt = new DataTable();

            if (filedItems == null || filedItems.Count == 0)
                return dt;

            // إنشاء عمود واحد باسم "Filed"
            dt.Columns.Add("Filed", typeof(string));

            // إضافة البيانات
            foreach (var item in filedItems)
            {
                DataRow row = dt.NewRow();
                row["Filed"] = item;
                dt.Rows.Add(row);
            }

            return dt;
        }
    }
}
