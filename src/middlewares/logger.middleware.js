import fs from "fs";

const fsPromise=fs.promises;

const  log=async function(logData){
   try{
    logData=`\n ${new Date().toString()} - ${logData}`;
    await fsPromise.appendFile("log.txt",logData);

   }catch(err){
     console.log(err);
   }
}

const logMiddleware = async function (req, res, next) {
  const logData = `${req.url}-${JSON.stringify(req.body)}`;

  // Log the request before processing
  if (!req.url.includes("signIn") || !req.url.includes("signUp")) {
    await log(logData);
  }

  // Wrap the next() call in a try-catch block to capture errors
  try {
    next();
  } catch (error) {
    const errorLogData = `\n${new Date().toString()} - ${req.url} - Error: ${error.message}`;
    await log(errorLogData);
    // Re-throw the error to be handled by the global error handler
    throw error;
  }
};
export default logMiddleware;