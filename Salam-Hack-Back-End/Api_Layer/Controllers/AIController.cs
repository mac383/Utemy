using Api_Layer.Common;
using Data_Access_Layer.Classes;
using Data_Access_Layer.Models.Messages;
using Fekra_BusinessLayer.services.chatGPT;
using Fekra_DataAccessLayer.models.chatGPT;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {

        private readonly GptService _gptService;

        public AIController(IHttpClientFactory httpClientFactory)
        {
            _gptService = new GptService(httpClientFactory);
        }

        [HttpPost("GetResponseFromGPT", Name = "GetResponseFromGPT")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetResponseFromGPTAsync([FromBody] md_ChatGptRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.UserInput))
                    return BadRequest(new ApiResponse(false, "المدخلات غير صالحة. UserInput مطلوب.", null));

                string gptResponse = await _gptService.GetResponseFromGptAsync(request, "");

                if (string.IsNullOrEmpty(gptResponse))
                    return StatusCode(500, new ApiResponse(false, "حدث خطأ أثناء معالجة الطلب.", new { success = false }));

                _ = Task.Run(async () =>
                {
                    await cls_AIMessages_D.HandleMessageAsync(new md_NewMessage(request.ConversationId, request.UserInput, gptResponse));
                });

                return Ok(new ApiResponse(true, "تم الحصول على إجابة من AI.", new { response = gptResponse }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse(false, "حدث خطأ أثناء معالجة الطلب.", new { message = ex.Message }));
            }
        }

        [HttpPost("GetResponseFromGptWithPrompt", Name = "GetResponseFromGptWithPrompt")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetResponseFromGptWithPromptAsync([FromBody] string prompt)
        {
            try
            {
                if (prompt == null || string.IsNullOrWhiteSpace(prompt))
                    return BadRequest(new ApiResponse(false, "المدخلات غير صالحة. prompt مطلوب.", null));

                string gptResponse = await _gptService.GetResponseFromGptWithPromptAsync(prompt);

                if (string.IsNullOrEmpty(gptResponse))
                    return StatusCode(500, new ApiResponse(false, "حدث خطأ أثناء معالجة الطلب.", new { success = false }));

                return Ok(new ApiResponse(true, "تم الحصول على إجابة من AI.", new { response = gptResponse }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse(false, "حدث خطأ أثناء معالجة الطلب.", new { message = ex.Message }));
            }
        }
    }
}
