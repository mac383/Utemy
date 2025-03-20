using Api_Layer.Common;
using Data_Access_Layer.Classes;
using Data_Access_Layer.Models.Notes;
using Data_Access_Layer.Models.PlayListLessones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayListLessonesController : ControllerBase
    {
        [HttpPost("NewPlayListLesson", Name = "NewPlayListLesson")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> NewPlayListLessonsAsync([FromBody] md_PlayListLessones_New PlayListLessons)
        {
            if (PlayListLessons == null)
                return BadRequest(new ApiResponse(false, "PlayListLesson doesn't inserted successfully.", new { }));

            try
            {
                int insertedId = await cls_PlayListlessones_D.NewAsync(PlayListLessons);

                if (insertedId <= 0)
                    return BadRequest(new ApiResponse(false, "PlayListLesson doesn't inserted successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "PlayListLesson inserted successfully."
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


        [HttpDelete("DeletePlaylistLessonNote", Name = "DeletePlaylistLessonNote")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> DeletePlaylistLessonNoteAsync([FromHeader] int LessonId)
        {

            if (LessonId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid Lesson ID.", new { }));

            try
            {
                bool response = await cls_PlayListlessones_D.DeleteNoteAsync(LessonId);
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
                            "Please verify the LessonId ID.",
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

        
        [HttpDelete("DeletePlaylistLessonFile", Name = "DeletePlaylistLessonFile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> DeletePlaylistLessonFileAsync([FromHeader] int LessonId)
        {
            if (LessonId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid Lesson ID.", new { }));

            try
            {
                bool response = await cls_PlayListlessones_D.DeleteFileAsync(LessonId);
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
                            "Please verify the LessonId ID.",
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

        
        [HttpDelete("DeletePlaylistLessonById", Name = "DeletePlaylistLessonById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> DeletePlaylistLessonByIdAsync([FromHeader] int LessonId)
        {
            if (LessonId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid Lesson ID.", new { }));

            try
            {
                bool response = await cls_PlayListlessones_D.DeleteLessonAsync(LessonId);
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
                            "Please verify the LessonId ID.",
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


        [HttpPatch("SetAsCompletedLesson", Name = "SetAsCompletedLesson")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> SetAsCompletedLessonAsync([FromHeader] int LessonID)
        {
            if (LessonID <= 0)
                return BadRequest(new ApiResponse(false, "Invalid Lesson ID.", new { }));

            try
            {
                bool isUpdated = await cls_PlayListlessones_D.SetAsCompletedAsync(LessonID);

                if (!isUpdated)
                    return BadRequest(new ApiResponse(false, "Completed doesn't updated successfully.", new { }));

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

        
        
        [HttpPatch("SetFile", Name = "SetFile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> SetFileAsync([FromBody] md_PlayListLessones_SetFile file)
        {
            if (file == null || file.LessonId <= 0)
                return BadRequest(new ApiResponse(false, "File doesn't updated successfully", new { }));

            try
            {
                bool isUpdated = await cls_PlayListlessones_D.SetFileAsync(file);

                if (!isUpdated)
                    return BadRequest(new ApiResponse(false, "File doesn't updated successfully.", new { }));

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



        [HttpPatch("SetNotes", Name = "SetNotes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> SetNotesAsync([FromHeader] string encodedNote, [FromHeader] int LessonId)
        {
            if (string.IsNullOrEmpty(encodedNote) || LessonId <= 0)
                return BadRequest(new ApiResponse(false, "Note doesn't updated successfully", new { }));

            try
            {
                // فك الترميز من Base64 إلى نص عادي
                byte[] noteBytes = Convert.FromBase64String(encodedNote);
                string Note = System.Text.Encoding.UTF8.GetString(noteBytes);

                bool isUpdated = await cls_PlayListlessones_D.SetNotesAsync(Note, LessonId);

                if (!isUpdated)
                    return BadRequest(new ApiResponse(false, "Note doesn't updated successfully.", new { }));

                return Ok(new ApiResponse(true, "success."));
            }
            catch
            {
                return StatusCode(500, new ApiResponse(false, "An error occurred while processing your request.", new { }));
            }
        }



        [HttpPut("UpdatePlayListLessons", Name = "UpdatePlayListLessons")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> UpdatePlayListLessonsAsync([FromBody] md_PlaylistLessons PlayListLessons)
        {
            if (PlayListLessons == null || PlayListLessons.LessonId <= 0)
                return BadRequest(new ApiResponse(false, "Play List Lesson doesn't updated successfully.", new { }));

            try
            {
                bool isUpdated = await cls_PlayListlessones_D.UpdateAsync(PlayListLessons);

                if (!isUpdated)
                    return BadRequest(new ApiResponse(false, "Play List Lesson doesn't updated successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "Play List Lesson updated successfully."
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


        [HttpGet("GetLessonByID", Name = "GetLessonByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetLessonByIDAsync([FromHeader] int lessonId)
        {
            if (lessonId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid lesson ID.", new { }));

            try
            {
                var response = await cls_PlayListlessones_D.GetBylessonIdAsync(lessonId);
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
                            "Please verify the lesson ID.",
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


        [HttpGet("GetPlayListsByID", Name = "GetPlayListsByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetPlayListsByIDAsync([FromHeader] int PlaylistId)
        {
            if (PlaylistId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid Playlist ID.", new { }));

            try
            {
                var response = await cls_PlayListlessones_D.GetPlayListsByIDAsync(PlaylistId);
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
                            "Please verify the Playlist ID.",
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
