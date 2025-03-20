using Api_Layer.Common;
using Fekra_BusinessLayer.services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YoutubeDataApiController : ControllerBase
    {
        [HttpGet("IsPlaylistUrlExist", Name = "IsPlaylistUrlExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> IsPlaylistUrlExistAsync([FromHeader] string url)
        {
            if (string.IsNullOrEmpty(url))
                return BadRequest(new ApiResponse(false, "URL can't be null.", new { }));

            try
            {
                bool response = await cls_YoutubeDataApiService.CheckPlaylistExists(url);
                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            response ? "True." : "False.",
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
