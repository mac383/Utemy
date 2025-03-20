using Api_Layer.Common;
using Data_Access_Layer.Classes;
using Data_Access_Layer.Models.AIUserMemory;
using Data_Access_Layer.Models.Files;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIUserMemoryController : ControllerBase
    {
        [HttpPut("UpdateUserMemory", Name = "UpdateUserMemory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> UpdateUserMemoryAsync([FromBody] md_UpdateUserMemory UserMemory)
        {
            if (UserMemory == null || UserMemory.MemoryId <= 0)
                return BadRequest(new ApiResponse(false, "User Memory doesn't updated successfully.", new { }));

            try
            {
                bool isUpdated = await cls_AIUserMemory_D.UpdateUserMemoryAsync(UserMemory);

                if (!isUpdated)
                    return BadRequest(new ApiResponse(false, "User Memory doesn't updated successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "User Memory updated successfully."
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


        [HttpGet("GetUserMemoryByUserId", Name = "GetUserMemoryByUserId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetUserMemoryByUserIdAsync([FromHeader] int userId)
        {
            if (userId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            try
            {
                var response = await cls_AIUserMemory_D.GetUserMemoryByUserIdAsync(userId);
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
                            "Please verify the user ID.",
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
