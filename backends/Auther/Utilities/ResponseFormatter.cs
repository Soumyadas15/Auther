using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Auther.Utilities
{
    public static class ResponseFormatter
    {
        public static IActionResult Success(string message, object? data = null)
        {
            return new JsonResult(new
            {
                status = "success",
                message,
                data
            })
            {
                StatusCode = StatusCodes.Status200OK
            };
        }

        public static IActionResult Created(string message, object? data = null)
        {
            return new JsonResult(new
            {
                status = "success",
                message,
                data
            })
            {
                StatusCode = StatusCodes.Status201Created
            };
        }

        public static IActionResult Error(int statusCode, string message)
        {
            return new JsonResult(new
            {
                status = "error",
                message
            })
            {
                StatusCode = statusCode
            };
        }
    }
}
