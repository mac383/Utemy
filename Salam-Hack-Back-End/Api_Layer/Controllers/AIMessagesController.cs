using Api_Layer.Common;
using Data_Access_Layer.Classes;
using Data_Access_Layer.Models.AIUserMemory;
using Data_Access_Layer.Models.Files;
using Data_Access_Layer.Models.Messages;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIMessagesController : ControllerBase
    {
        [HttpPost("HandleMessage", Name = "HandleMessage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> HandleMessageAsync([FromBody] md_NewMessage Message)
        {
            try
            {
                bool isInserted = await cls_AIMessages_D.HandleMessageAsync(Message);

                if (!isInserted)
                    return BadRequest(new ApiResponse(false, "Message doesn't inserted successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "Message inserted successfully."
                        )
                    );
            }
            catch
            {
                return StatusCode
                    (
                        500,
                        new ApiResponse
                        (
                            false,
                            "An error occurred while processing your request.",
                            new { }
                        )
                    );
            }
        }

        
        [HttpGet("GetMessagesByConversationId", Name = "GetMessagesByConversationId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetMessagesByConversationIdAsync([FromHeader] int conversationId)
        {
            if (conversationId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid conversation ID.", new { }));

            try
            {
                var response = await cls_AIMessages_D.GetMessagesByConversationIdAsync(conversationId);
                if (response != null)
                    return Ok
                        (
                            new ApiResponse
                            (
                                true,
                                "Success.",
                                new
                                {
                                    Response = response
                                }
                            )
                        );

                return BadRequest
                    (
                        new ApiResponse
                        (
                            false,
                            "Please verify the conversation ID.",
                            new
                            {
                                Response = response
                            }
                        )
                    );
            }
            catch
            {
                return StatusCode
                    (
                        500,
                        new ApiResponse
                        (
                            false,
                            "An error occurred while processing your request.",
                            new { }
                        )
                    );
            }
        }
    }
}
