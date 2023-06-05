// MIDDLEWARE FOR HANDLING AUTHENTICATION
import User from '../Models/horsey-user';

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization');
  try {
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        response: {
          message: "Authentication required. Access token not provided.",
        },
      });
    }

    const loggedinuser = await User.findOne({ accessToken: accessToken });
    if (loggedinuser) {
      req.accessToken = accessToken;
      req.loggedinuser = loggedinuser;
      next();
    } else {
      res.status(401).json({
        success: false,
        response: {
          message: "Invalid access token. You need to log in.",
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
    });
  }
};

export default authenticateUser;

// middlewares.js explained by ChatGPT
// This code defines a middleware function named authenticateUser, which is responsible for handling authentication
// in an Express application. Here's a breakdown of its functionality:

// 1. The code imports the User model from the ../Models/horsey-user file.

// 2. The authenticateUser function is an async function that takes three parameters: req (request), res (response),
// and next. These parameters are typical for Express middleware functions.

// 3. Inside the function, it retrieves the Authorization header value from the request using req.header('Authorization')
// and assigns it to the accessToken variable. This header is typically used for sending authentication tokens.

// 4. It then checks if the accessToken exists. If it doesn't exist, it means the user is not authenticated, and it
// returns a JSON response with a 401 status code (Unauthorized) and an error message indicating that authentication
// is required and the access token is not provided.

// 5. If the accessToken exists, it attempts to find a user in the database based on the accessToken using
// User.findOne({ accessToken: accessToken }). This assumes that there is a User model with a field named
// accessToken in the ../Models/horsey-user file.

// 6. If a user is found (loggedinuser is truthy), it assigns the accessToken and loggedinuser to the request object
// (req.accessToken and req.loggedinuser respectively) so that they can be accessed by subsequent middleware or
// route handlers. Then, it calls the next() function to proceed to the next middleware or route handler.

// 7. If no user is found, it returns a JSON response with a 401 status code and an error message indicating that
// the access token is invalid and the user needs to log in.

// 8. If any error occurs during the execution of the function (e.g., an exception is thrown), it catches the error,
// returns a JSON response with a 500 status code (Internal Server Error), and includes the error object in the response.

// 9. Finally, the authenticateUser function is exported as the default export of the module.

// This middleware can be used in an Express application by importing it and adding it as a middleware function
// to the desired route or routes where authentication is required. It checks for the presence of an access token,
// verifies it against the User model, and proceeds with the request if the token is valid. Otherwise, it returns
// appropriate error responses.