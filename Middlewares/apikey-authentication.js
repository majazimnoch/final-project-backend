// this middleware is for API-authentication
// this checks if the client that calls the API is a trusted source
const authenticateApiKey = async (req, res, next) => {
    const actualApiKey = req.header('x-api-key');
    const correctApiKey = process.env.API_KEY
    if (actualApiKey === correctApiKey) {next()}
    else {
        return res.status(401).json({
          success: false,
          response: {
            message: "Provided API-key incorrect.",
          },
        });
      }
}

export default authenticateApiKey;