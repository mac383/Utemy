using Api_Layer.Common;
using Data_Access_Layer.Classes;
using Data_Access_Layer.Models.Files;
using Data_Access_Layer.Models.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        [HttpGet("GetFilesByUserId", Name = "GetFilesByUserId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetFilesByUserIdAsync([FromHeader] int userId)
        {
            if (userId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            try
            {
                var response = await cls_Files_D.GetByUserIdAsync(userId);
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



        [HttpGet("GetByFileId", Name = "GetByFileId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetByFileIdAsync([FromHeader] int fileId)
        {
            if (fileId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid File ID.", new { }));

            try
            {
                var response = await cls_Files_D.GetByFileIdAsync(fileId);
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
                            "Please verify the file ID.",
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


        [HttpPost("NewFile", Name = "NewFile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> NewFileAsync([FromBody] md_FilesNew file)
        {
            try
            {
                int insertedId = await cls_Files_D.NewFileAsync(file);

                if (insertedId <= 0)
                    return BadRequest(new ApiResponse(false, "File doesn't inserted successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "File inserted successfully."
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


        [HttpPut("UpdateFile", Name = "UpdateFile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> UpdateFileAsync([FromBody] md_FileUpdate file)
        {
            if (file == null || file.FileId <= 0)   
                    return BadRequest(new ApiResponse(false, "File doesn't updated successfully.", new { }));

            try
            {
                bool isUpdated = await cls_Files_D.UpdateFileAsync(file);

                if (!isUpdated)
                    return BadRequest(new ApiResponse(false, "File doesn't updated successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "File updated successfully."
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


        [HttpPatch("DeleteFile", Name = "DeleteFile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> DeleteFileAsync([FromHeader] int fileId)
        {

            if (fileId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid file ID.", new { }));

            try
            {
                bool response = await cls_Files_D.DeleteFileAsync(fileId);
                if (response)
                    return Ok
                        (
                            new ApiResponse
                            (
                                true,
                                "Success.",
                                new { Response = response }
                            )
                        );

                return BadRequest
                    (
                        new ApiResponse
                        (
                            true,
                            "Please verify the file ID.",
                            new { Response = response }
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
