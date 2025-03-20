namespace Api_Layer.Common
{
    public class ApiResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }
        public object? data { get; set; }

        public ApiResponse(bool status, string message, object? dataObj = null)
        {
            Status = status;
            Message = message;
            data = dataObj;
        }
    }
}
