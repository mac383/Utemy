using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Fekra_BusinessLayer.services
{
    public class cls_YoutubeDataApiService
    {
        // completed testing.    
        private static string apiKey = "AIzaSyCJVIpSjBQwWILIIBRK6hkVicJg-41okIs";

        // completed testing. 
        private static DataTable CreateVideoDataTable()
        {
            DataTable table = new DataTable();
            table.Columns.Add("Title", typeof(string));
            table.Columns.Add("VideoLink", typeof(string));
            table.Columns.Add("VideoId", typeof(string));
            return table;
        }

        // completed testing. 
        public static string? ExtractVideoId(string videoUrl)
        {
            var regex = new Regex(@"[?&]v=([^&]+)");
            var match = regex.Match(videoUrl);

            if (match.Success)
            {
                return match.Groups[1].Value;
            }

            return null;  // إذا لم يتم العثور على Video ID
        }

        // completed testing.
        public static string? ExtractPlaylistId(string playlistUrl)
        {
            playlistUrl = Uri.UnescapeDataString(playlistUrl);

            var regex = new Regex(@"[&?]list=([a-zA-Z0-9_-]+)");
            var match = regex.Match(playlistUrl);

            if (match.Success)
            {
                return match.Groups[1].Value;
            }

            return null;  // إذا لم يتم العثور على Playlist ID
        }

        //completed testing.
        public static async Task<bool> CheckPlaylistExists(string playlistURL)
        {
            string? playlistId = ExtractPlaylistId(playlistURL);

            if (playlistId == null)
                return false;

            var url = $"https://www.googleapis.com/youtube/v3/playlists?part=id&id={playlistId}&key={apiKey}";

            using (HttpClient client = new HttpClient())
            {
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode) return false;

                var content = await response.Content.ReadAsStringAsync();
                JObject jsonResponse = JObject.Parse(content);

                return jsonResponse["items"]?.Any() == true;
            }
        }

        // completed testing. 
        public static async Task<DataTable?> GetPlaylistVideos(string playlistURL)
        {
            string? playlistId = ExtractPlaylistId(playlistURL);

            if (playlistId == null)
                return null;

            if (!await CheckPlaylistExists(playlistURL))
                return null;

            string baseUrl = $"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlistId}&maxResults=50&key={apiKey}";
            string? nextPageToken = "";
            DataTable videoTable = CreateVideoDataTable();

            using (HttpClient client = new HttpClient())
            {
                do
                {
                    string url = baseUrl + $"&pageToken={nextPageToken}";
                    var response = await client.GetStringAsync(url);
                    JObject jsonResponse = JObject.Parse(response);

                    // معالجة الفيديوهات
                    foreach (var item in jsonResponse["items"])
                    {
                        DataRow row = videoTable.NewRow();
                        row["Title"] = item["snippet"]?["title"]?.ToString();
                        row["VideoLink"] = $"https://www.youtube.com/watch?v={item["snippet"]?["resourceId"]?["videoId"]}";
                        row["VideoId"] = item["snippet"]?["resourceId"]?["videoId"]?.ToString();
                        videoTable.Rows.Add(row);
                    }

                    // احصل على nextPageToken إذا كان موجوداً
                    nextPageToken = jsonResponse["nextPageToken"]?.ToString();

                } while (!string.IsNullOrEmpty(nextPageToken));  // كرر حتى لا يكون هناك المزيد من الصفحات
            }

            return videoTable;
        }

        // استخراج صورة قائمة التشغيل
        public static async Task<string?> GetPlaylistThumbnail(string playlistId)
        {

            // استعلام API للحصول على بيانات قائمة التشغيل
            string url = $"https://www.googleapis.com/youtube/v3/playlists?part=snippet&id={playlistId}&key={apiKey}";

            using (HttpClient client = new HttpClient())
            {
                var response = await client.GetStringAsync(url);
                JObject jsonResponse = JObject.Parse(response);

                // استخراج الصورة المصغرة من الـ JSON
                var thumbnailUrl = jsonResponse["items"]?[0]?["snippet"]?["thumbnails"]?["high"]?["url"]?.ToString();

                return thumbnailUrl; // إرجاع رابط الصورة المصغرة
            }
        }

        public static async Task<string?> GetPlaylistTitle(string playlistId)
        {
            string url = $"https://www.googleapis.com/youtube/v3/playlists?part=snippet&id={playlistId}&key={apiKey}";

            using (HttpClient client = new HttpClient())
            {
                var response = await client.GetStringAsync(url);
                JObject jsonResponse = JObject.Parse(response);

                var title = jsonResponse["items"]?[0]?["snippet"]?["title"]?.ToString();

                return title; // إرجاع عنوان قائمة التشغيل
            }
        }

    }
}
