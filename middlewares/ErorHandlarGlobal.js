const ErrorHandlerGlobal = (error, req, res, next) => {
   error.statusCode = error.statusCode || 500;
   error.status = error.status || "error";
   error.message = error.message || "Internal Server Error";
   console.log("Middleware Error Hadnling", error);

   res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      messageUz: error.message,
   });
};

export default ErrorHandlerGlobal;
