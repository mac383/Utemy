using Api_Layer.Common;
using Data_Access_Layer.Classes;
using Data_Access_Layer.Models.Fields;
using Data_Access_Layer.Models.Files;
using Data_Access_Layer.Models.Notes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FieldsController : ControllerBase
    {

        [HttpGet("GetFieldsByUserId", Name = "GetFieldsByUserId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetFieldsByUserIdAsync([FromHeader] int userId)
        {
            if (userId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            try
            {
                var response = await cls_Fields_D.GetByUserIDAsync(userId);
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


        [HttpGet("IsFieldsExist", Name = "IsFieldsExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> IsFieldsExistAsync([FromHeader] int Field)
        {
            if (Field <= 0)
                return BadRequest(new ApiResponse(false, "Field Id is Invalid", new { }));

            try
            {
                bool isUpdated = await cls_Fields_D.IsExistAsync(Field);

                if (!isUpdated)
                    return BadRequest(new ApiResponse(false, "Field Id doesn't Exist", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "success."
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


        [HttpPatch("DeleteFieldById", Name = "DeleteFieldById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> DeleteFieldByIdAsync([FromHeader] int fileId)
        {
            if (fileId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid file ID.", new { }));

            try
            {
                bool response = await cls_Fields_D.DeleteAsync(fileId);
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


        [HttpPost("NewField", Name = "NewField")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> NewFieldAsync([FromHeader]string Name, [FromHeader]int UserId)
        {
            try
            {
                int insertedId = await cls_Fields_D.NewAsync(Name, UserId);

                if (insertedId <= 0)
                    return BadRequest(new ApiResponse(false, "Field doesn't inserted successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "Field inserted successfully."
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
