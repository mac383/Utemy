using Api_Layer.Common;
using Data_Access_Layer.Classes;
using Data_Access_Layer.Models.UserPlayLists;
using Fekra_BusinessLayer.services;
using Fekra_BusinessLayer.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPlaylistController : ControllerBase
    {
        [HttpGet("IsPlaylistExist", Name = "IsPlaylistExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> IsPlaylistExistAsync([FromHeader] int PlaylistId)
        {
            if (PlaylistId <= 0)
                return BadRequest(new ApiResponse(false, "PlaylistId Id is Invalid", new { }));

            try
            {
                bool isUpdated = await cls_UserPlayLists_D.IsExistAsync(PlaylistId);

                if (!isUpdated)
                    return BadRequest(new ApiResponse(false, "PlaylistId Id doesn't Exist", new { }));

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

        [HttpPost("NewUserPlaylist", Name = "NewUserPlaylist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> NewUserPlaylistAsync([FromHeader] int userId, [FromHeader] string playlistURL)
        {
            try
            {
                string? playlistId = cls_YoutubeDataApiService.ExtractPlaylistId(playlistURL);

                if (playlistId == null)
                    return BadRequest(new ApiResponse(false, "User Playlist doesn't inserted successfully.", new { }));

                DataTable? lessons = await cls_YoutubeDataApiService.GetPlaylistVideos(playlistURL);

                string? coverURL = await cls_YoutubeDataApiService.GetPlaylistThumbnail(playlistId);

                string coverName = KeyProvider.GetKey(8, 4, KeyProvider.EN_KeyType.NumbersLetters);

                string? playlistTitle = await cls_YoutubeDataApiService.GetPlaylistTitle(playlistId);

                md_UserPlayLists_New playlist = new md_UserPlayLists_New
                    (
                        userId, playlistTitle ?? "Unknown Title", playlistURL, playlistId, coverURL ?? "Unknown Cover", lessons
                    );

                int insertedId = await cls_UserPlayLists_D.NewAsync(playlist);

                if (insertedId <= 0)
                    return BadRequest(new ApiResponse(false, "User Playlist doesn't inserted successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "User Playlist inserted successfully."
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

        [HttpGet("GetByUserID", Name = "GetByUserID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetByUserIDAsync([FromHeader] int UserId)
        {
            if (UserId <= 0)
                return BadRequest(new ApiResponse(false, "User Id is Invalid", new { }));

            try
            {
                var resopnse = await cls_UserPlayLists_D.GetByUserIDAsync(UserId);

                if (resopnse == null)
                    return BadRequest(new ApiResponse(false, "Invalid User Id", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "success.",
                            new 
                            {
                                resopnse
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

        [HttpPut("SetAsCompletedPlaylist", Name = "SetAsCompletedPlaylist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> SetAsCompletedPlaylistAsync([FromHeader] int PlaylistId)
        {
            if (PlaylistId <= 0)
                return BadRequest(new ApiResponse(false, "Playlist Id is Invalid", new { }));

            try
            {
                var isUpdated = await cls_UserPlayLists_D.SetAsCompletedAsync(PlaylistId);

                if (isUpdated)
                    return BadRequest(new ApiResponse(false, "Invalid Playlist Id", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "success.",
                            new 
                            {
                                response = isUpdated
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
