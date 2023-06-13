// import User from '../Models/user-users';
// import
// const authenticateUser = async (req, res, next) => {
//   const accessToken = req.header('Authorization');
//   try {
//     if (!accessToken) {
//       return res.status(401).json({
//         success: false,
//         response: {
//           message: "Authentication required. Access token not provided.",
//         },
//       });
//     }

//     const loggedinuser = await User.findOne({ accessToken: accessToken });
//     if (loggedinuser) {
//       req.accessToken = accessToken;
//       req.loggedinuser = loggedinuser;
//       next();
//     } else {
//       res.status(401).json({
//         success: false,
//         response: {
//           message: "Invalid access token. You need to log in.",
//         },
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       response: error,
//     });
//   }
// };

// export default authenticateUser;

// const authenticateUser = async (req, res, next) => {
//   const accessToken = req.header("Authorization");
//   try {
//     const user = await User.findOne({accessToken: accessToken});
//     if (user) {
//     req.user = user;
//     next();
//     } else {
//         res.status(401).json({
//           success: false,
//           response: "Please log in"
//       })
//     }
//   } catch (e) {
//     res.status(500).json({
//      success: false,
//       response: e
//     });
//   }
// };