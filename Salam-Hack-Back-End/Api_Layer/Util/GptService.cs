using Fekra_DataAccessLayer.models.chatGPT;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Azure.Core;
using System.Reflection;

namespace Fekra_BusinessLayer.services.chatGPT
{
    public class GptService
    {
        private readonly HttpClient _httpClient;

        public GptService(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<string> GetResponseFromGptAsync(md_ChatGptRequest userRequest, string summary)
        {
            if (string.IsNullOrWhiteSpace(userRequest.UserInput))
                return string.Empty;

            try
            {
                string systemMessage = new PromptGenerator(
                    userRequest.UserFullName,
                    userRequest.MemoryData
                ).GenerateSubjectPrompt();

                var messages = BuildMessages(systemMessage, userRequest);

                //model = "gpt-4",
                //model = "gpt-3.5-turbo",
                //model = "gpt-4-turbo",

                string model = "gpt-3.5-turbo";

                var requestBody = new
                {
                    model = model,
                    messages,
                    temperature = 0.7
                };

                var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

                var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
                {
                    Headers =
                    {
                        { "Authorization", $"Bearer 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" }
                    },
                    Content = content
                };

                AddOptionalHeaders(request);

                var response = await _httpClient.SendAsync(request);

                return await HandleResponseAsync(response);
            }
            catch
            {
                return string.Empty;
            }
        }

        public async Task<string> GetResponseFromGptWithPromptAsync(string prompt)
        {
            if (string.IsNullOrWhiteSpace(prompt))
                return string.Empty;

            try
            {
                // استخدام الـ prompt المستلم مباشرة
                // إعداد رسالة النظام (يمكن تكييفها حسب احتياجاتك)
                string systemMessage = "أنت مساعد تعليمي متخصص في إنشاء اختبارات تقييمية عالية الجودة للطلاب.";

                // بناء رسائل المحادثة
                var messages = new List<object>
                {
                    new { role = "system", content = systemMessage },
                    new { role = "user", content = prompt }
                };

                // إختيار النموذج المناسب
                string model = "gpt-3.5-turbo";

                // بناء جسم الطلب
                var requestBody = new
                {
                    model = model,
                    messages,
                    temperature = 0.7
                };

                // إنشاء محتوى الطلب
                var content = new StringContent(
                    JsonConvert.SerializeObject(requestBody),
                    Encoding.UTF8,
                    "application/json"
                );

                // إنشاء طلب HTTP
                var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
                {
                    Headers =
                    {
                        {
                            "Authorization", $"Bearer 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" 
                        }
                    },
                        Content = content
                };

                // إضافة ترويسات اختيارية إذا كانت مطلوبة
                AddOptionalHeaders(request);

                var response = await _httpClient.SendAsync(request);

                return await HandleResponseAsync(response);
            }
            catch
            {
                return string.Empty;
            }
        }

        private List<object> BuildMessages(string systemMessage, md_ChatGptRequest userRequest)
        {
            var messages = new List<object>
            {
                new { role = "system", content = systemMessage }
            };

            if (userRequest.PreviousConversations?.Any() == true)
            {
                var chatHistory = userRequest.PreviousConversations
                    .TakeLast(5)
                    .Select(pc => (pc.Request, pc.Response));

                foreach (var (question, answer) in chatHistory)
                {
                    messages.Add(new { role = "user", content = question });
                    messages.Add(new { role = "assistant", content = answer });
                }
            }
            else
            {
                messages.Add(new { role = "assistant", content = "أهلًا وسهلًا! أنا ظفر، معلمتك الذكية. شلونك اليوم؟ 😊\n إذا كان عندك أي سؤال أو حاب تعرف شي، أنا هنا بكل سرور أساعدك!",});
            }

            messages.Add(new { role = "user", content = userRequest.UserInput });
            return messages;
        }

        private void AddOptionalHeaders(HttpRequestMessage request)
        {
            request.Headers.Add("OpenAI-Organization", "org-r77QrxVxNvWz1Mg02WxTq1t0");

            request.Headers.Add("OpenAI-Project", "proj_7dq4OtH0Md8pkHyYgyObtw33");
        }

        private async Task<string> HandleResponseAsync(HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                var jsonResponse = JsonConvert.DeserializeObject<dynamic>(responseBody);
                return jsonResponse?.choices?[0]?.message?.content?.ToString() ?? string.Empty;
            }
            else
            {
                return string.Empty;
            }
        }


        /// <summary>
        /// دالة غير مستخدمة حالياً لأن النظام يعتمد على OpenAI بدلاً من DeepSeek.
        /// تم الاحتفاظ بها للمرجعية أو للاستخدام المستقبلي إذا دعت الحاجة.
        /// </summary>
        public async Task<string> GetResponseFromDeepSeekAsync(md_ChatGptRequest userRequest, string summary)
        {
            if (string.IsNullOrWhiteSpace(userRequest.UserInput))
                return string.Empty;

            string _apiKey = "sk-0877a5680e8649ab9f9d4104bf4ec24d";

            try
            {
                string systemMessage = new PromptGenerator(
                    userRequest.UserFullName,
                    userRequest.MemoryData
                ).GenerateSubjectPrompt();

                var messages = BuildMessages(systemMessage, userRequest);

                // استخدام نموذج DeepSeek-V3
                string model = "deepseek-chat";

                var requestBody = new
                {
                    model = model,
                    messages,
                    temperature = 0.7
                };

                var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

                var request = new HttpRequestMessage(HttpMethod.Post, "https://api.deepseek.com/v1/chat/completions")
                {
                    Headers =
                    {
                        { "Authorization", $"Bearer {_apiKey}" }
                    },
                    Content = content
                };

                var response = await _httpClient.SendAsync(request);

                return await HandleResponseAsync(response);
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
