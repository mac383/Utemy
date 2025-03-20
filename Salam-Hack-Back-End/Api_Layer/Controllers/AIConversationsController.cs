using Api_Layer.Common;
using Data_Access_Layer.Classes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIConversationsController : ControllerBase
    {
        [HttpPost("AddNewConversation", Name = "AddNewConversation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> AddNewConversationAsync([FromHeader] int userId)
        {
            if (userId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid UserId.", new { Success = false }));

            try
            {
                int conversationId = await cls_AiConversations_D.AddNewConversationAsync(userId);

                if (conversationId <= 0)
                    return StatusCode(500, new ApiResponse(false, "Failed to create new conversation.", new { Success = false }));

                return Ok(new ApiResponse(true, "Conversation created successfully.", new { ConversationId = conversationId }));
            }
            catch
            {
                return StatusCode(500, new ApiResponse(false, "An error occurred while processing your request.", new { Success = false }));
            }
        }

        [HttpPut("UpdateConversationTitle", Name = "UpdateConversationTitle")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> UpdateConversationTitleAsync([FromHeader] int conversationId, [FromBody] string title)
        {
            try
            {
                bool success = await cls_AiConversations_D.UpdateConversationTitleAsync(conversationId, title);

                if (!success)
                    return StatusCode(500, new ApiResponse(false, "Failed to update conversation title.", new { Success = false }));

                return Ok(new ApiResponse(true, "Conversation title updated successfully.", new { Success = success }));
            }
            catch
            {
                return StatusCode(500, new ApiResponse(false, "An error occurred while processing your request.", new { Success = false }));
            }
        }

        [HttpGet("GetAllConversations", Name = "GetAllConversations")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetAllConversationsAsync([FromHeader] int userId)
        {
            if (userId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid UserId.", new { Success = false }));

            try
            {
                var conversations = await cls_AiConversations_D.GetAllConversationsAsync(userId);

                if (conversations == null || conversations.Count == 0)
                    return NotFound(new ApiResponse(false, "No conversations found.", new { Success = false }));

                return Ok(new ApiResponse(true, "Conversations retrieved successfully.", new { Conversations = conversations }));
            }
            catch
            {
                return StatusCode(500, new ApiResponse(false, "An error occurred while processing your request.", new { Success = false }));
            }
        }

        [HttpDelete("DeleteConversation", Name = "DeleteConversation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> DeleteConversationAsync([FromHeader] int conversationId)
        {
            if (conversationId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid ConversationId.", new { Success = false }));

            try
            {
                bool success = await cls_AiConversations_D.DeleteConversationAsync(conversationId);

                if (!success)
                    return StatusCode(500, new ApiResponse(false, "Failed to delete conversation.", new { Success = false }));

                return Ok(new ApiResponse(true, "Conversation deleted successfully.", new { Success = success }));
            }
            catch
            {
                return StatusCode(500, new ApiResponse(false, "An error occurred while processing your request.", new { Success = false }));
            }
        }
    }
}
