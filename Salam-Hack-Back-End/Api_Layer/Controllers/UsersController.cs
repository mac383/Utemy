using Api_Layer.Common;
using Azure.Core;
using Data_Access_Layer.Classes;
using Data_Access_Layer.database;
using Data_Access_Layer.Models.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Api_Layer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class UsersController : ControllerBase
    {
        // In This Function We Have Issue.
        [HttpPost("NewUser", Name = "NewUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> NewUserAsync([FromBody] md_User_New user)
        {
            try
            {
                DataTable filedsTable = user.GetFiledsAsDataTable();
                int insertedId = await cls_Users_D.NewAsync(user, filedsTable);

                if (insertedId <= 0)
                    return BadRequest(new ApiResponse(false, "User doesn't inserted successfully.", new { }));

                return Ok
                    (
                        new ApiResponse
                        (
                            true,
                            "User inserted successfully."
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


        [HttpPatch("SetUserEmail", Name = "SetUserEmail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> SetUserEmailAsync([FromBody] md_User_SetEmail email)
        {

            if (email.Userid <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            try
            {
                bool response = await cls_Users_D.SetEmailAsync(email);
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
                            "Please verify the user ID and email.",
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


        [HttpPatch("SetUserFullName/{userId}/{fullName}", Name = "SetUserFullName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> SetFullNameAsync([FromBody] md_User_SetFullName fullName)
        {
            if (fullName.Userid <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            try
            {
                bool response = await cls_Users_D.SetFullNameAsync(fullName);
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
                            "Please verify the user ID and fullname.",
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

        [HttpPatch("SetUserImage", Name = "SetUserImage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> SetUserImageAsync([FromBody] md_User_SetImge image)
        {
            if (image.UserId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            try
            {
                bool response = await cls_Users_D.SetImageAsync(image);
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
                            "Please verify the user ID and name image and image url.",
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



        [HttpPatch("SetUserPassword", Name = "SetUserPassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> SetUserPasswordAsync([FromBody] md_User_SetPassword password)
        {
            if (password.Userid <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            try
            {
                bool response = await cls_Users_D.SetPasswordAsync(password);
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
                            "Please verify the user ID and password.",
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

        [HttpPatch("SetUserName", Name = "SetUserName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> SetUserNameAsync([FromBody] md_User_SetUserName username)
        {
            if (username.Userid <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            if (username.UserName.Length > 25)
                return BadRequest(new ApiResponse(false, "Invalid username (max length: 25).", new { }));


            try
            {
                bool response = await cls_Users_D.SetUserNameAsync(username);
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
                            "Please verify the user ID and username.",
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


        [HttpGet("IsUserUserNameExist", Name = "IsUserUserNameExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> IsUserUserNameExistAsync([FromHeader] string username)
        {
            if (username.Length > 25)
                return BadRequest(new ApiResponse(false, "Invalid username (max length: 25).", new { }));

            try
            {
                bool isExist = await cls_Users_D.IsUserNameExistAsync(username);
                if (isExist)
                    return Ok
                        (
                            new ApiResponse
                            (
                                true,
                                isExist ? "Username already exists." : "Username does not exist.",
                                new
                                {
                                    IsExist = isExist
                                }
                            )
                        );

                return BadRequest
                    (
                        new ApiResponse
                        (
                            false,
                            "Username does not exist.",
                            new
                            {
                                IsExist = isExist
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


        [HttpGet("IsImageNameExist", Name = "IsImageNameExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> IsImageNameExistAsync([FromHeader] string ImageName)
        {
            if (string.IsNullOrEmpty(ImageName) || ImageName.Length > 25)
                return BadRequest(new ApiResponse(false, "Invalid Image (max length: 25).", new { }));


            try
            {
                bool isExist = await cls_Users_D.IsImageNameExistAsync(ImageName);
                if (isExist)
                    return Ok
                        (
                            new ApiResponse
                            (
                                true,
                                isExist ? "Image Name already exists." : "Image Name does not exist.",
                                new
                                {
                                    IsExist = isExist
                                }
                            )
                        );

                return BadRequest
                    (
                        new ApiResponse
                        (
                            false,
                            "Image Name does not exist.",
                            new
                            {
                                IsExist = isExist
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


        [HttpGet("IsEmailExist", Name = "IsEmailExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> IsEmailExistAsync([FromHeader] string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest(new ApiResponse(false, "Invalid email.", new { }));


            try
            {
                bool isExist = await cls_Users_D.IsEmailExistAsync(email);
                if (isExist)
                    return Ok
                        (
                            new ApiResponse
                            (
                                true,
                                isExist ? "email already exists." : "email Name does not exist.",
                                new
                                {
                                    IsExist = isExist
                                }
                            )
                        );

                return BadRequest
                    (
                        new ApiResponse
                        (
                            false,
                            "email Name does not exist.",
                            new
                            {
                                IsExist = isExist
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


        [HttpGet("GetByAuth", Name = "GetByAuth")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> GetByAuthAsync([FromHeader] string Email, [FromHeader] string Password)
        {
            if (string.IsNullOrEmpty(Email) || Email.Length > 150)
                return BadRequest(new ApiResponse(false, "Invalid username or email.", new { }));

            if (string.IsNullOrEmpty(Password) || Password.Length > 150)
                return BadRequest(new ApiResponse(false, "Invalid password.", new { }));

            try
            {
                var response = await cls_Users_D.GetByAuthAsync(Email, Password);
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
                            "Username Or Password does not exist.",
                            new
                            {
                                IsExist = response
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


        [HttpPatch("DeleteUserImage", Name = "DeleteUserImage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> DeleteUserImageAsync([FromHeader] int userId)
        {

            if (userId <= 0)
                return BadRequest(new ApiResponse(false, "Invalid user ID.", new { }));

            try
            {
                bool response = await cls_Users_D.DeleteImageAsync(userId);
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
                            "Please verify the user ID.",
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
