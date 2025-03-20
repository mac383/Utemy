using Api_Layer.Common;
using Data_Access_Layer.Classes;
using Data_Access_Layer.Models.Notes;
using Data_Access_Layer.Models.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {

        [HttpGet("GetNotesByUserId", Name = "GetNotesByUserId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetNotesByUserIdAsync([FromHeader] int userId)
        {
            if (userId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            try
            {
                var response = await cls_Notes_D.GetNotesByUserIdAsync(userId);
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



        [HttpGet("GetByNoteId", Name = "GetByNoteId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetByNoteIdAsync([FromHeader] int NoteId)
        {
            if (NoteId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid Note ID.", new { }));

            try
            {
                var response = await cls_Notes_D.GetByNoteIdAsync(NoteId);
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
                            "Please verify the Note ID.",
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


        [HttpPost("NewNote", Name = "NewNote")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> NewNoteAsync([FromBody] md_NotesNew Note)
        {
            if (Note == null)
                return BadRequest(new ApiResponse(false, "PlayListLesson doesn't inserted successfully.", new { }));

            try
            {
                int insertedId = await cls_Notes_D.NewAsync(Note);

                if (insertedId <= 0)
                    return BadRequest(new ApiResponse(false, "Note doesn't inserted successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "Note inserted successfully."
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


        [HttpPut("UpdateNote", Name = "UpdateNote")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> UpdateNoteAsync([FromBody] md_NoteUpdate Note)
        {
            if (Note == null || Note.NoteId <= 0)
                return BadRequest(new ApiResponse(false, "Note doesn't updated successfully.", new { }));

            try
            {
                bool isUpdated = await cls_Notes_D.UpdateNoteAsync(Note);

                if (!isUpdated)
                    return BadRequest(new ApiResponse(false, "Note doesn't updated successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "Note updated successfully."
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


        [HttpDelete("DeleteNote", Name = "DeleteNote")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> DeleteNoteAsync([FromHeader] int NoteId)
        {

            if (NoteId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid Note ID.", new { }));

            try
            {
                bool response = await cls_Notes_D.DeleteNoteAsync(NoteId);
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
                            "Please verify the Note ID.",
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
