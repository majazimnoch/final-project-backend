import authenticateUser from '../Middlewares/authentication'
import express from "express";
const router = express.Router()
import mongoose from "mongoose";
import Horse from '../Models/horses';


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/horsey";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// POST new horse to the logged in user
router.post("/horses", authenticateUser, async (req, res) => {
  try {
    const { horseName } = req.body;
    const loggedinuser = req.loggedinuser; // Access the logged in user from req object

    const newHorse = await new Horse({
      horseName: horseName, 
      horseActiveuser: loggedinuser._id,
    }).save();
    if (newHorse) {
      res.status(201).json({
        success: true, 
        response: {
          message: "New horse successfully created",
          data: newHorse
      } 
      })
    } else {
      res.status(404).json({
        success: false, 
        response: {
          message: "New horse could not be created",
      } 
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false, 
      response: error, 
      message: "An error occurred while trying to create a new horse"
    });
  }
})

  // GET all horses only from logged in user
router.get("/horses", authenticateUser, async (req, res) => {
  const loggedinUserId = req.loggedinuser._id; // Get the ID of the logged-in user

  try {
    const allHorses = await Horse.find({ horseActiveuser: loggedinUserId });
    
      if (allHorses) {
        res.status(200).json({
          success: true,
          response: {
            message: "Successfully fetched all horses",
            data: allHorses,
          }
        })
      } else {
        res.status(404).json({
          success: false, 
          response: {
            message: "Could not fetch all horses",
          } 
        })
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while trying to fetch all horses"
      })
    }
  })


// GET for a single horse
router.get("/horses/:horseId", authenticateUser, async (req, res) => {
  const { horseId } = req.params; // Get the horseId from the request parameters

  try {
    const singleHorse = await Horse.findById(horseId);
    // this check if a singleHorse is found
    if (singleHorse) {
      // this checks if the active user is the same as the logged-in
      if (singleHorse.horseActiveuser === loggedinUserId) {
      res.status(200).json({
        success: true,
        response: {
            message: "Successfully fetched the horse",
            data: singleHorse,
          }
        });
      } else {
        res.status(403).json({
          success: false,
          response: {
            message: "Access denied. You do not have permission to view this horse.",
          }
        });
      }
      } else {
        res.status(404).json({
          success: false, 
          response: {
            message: "Could not fetch the horse",
          } 
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while trying to fetch the horse"
      })
    }
  })


// We might add a PATCH to edit the single horse in the database
router.patch("/horses/:horseId", authenticateUser, async (req, res) => {
  const { horseId } = req.params; // Get the horse id from the request parameters

  try {
    const { horseName, horsePrevious } = req.body; 

    const updatedSingleHorse = await Horse.findByIdAndUpdate(
      horseId,
      {
        horseName: horseName,
        horsePrevious: horsePrevious
      },
      { new: true }
    );

    if (updatedSingleHorse) {
      res.status(200).json({
        success: true,
        response: {
            message: "Successfully updated the horse",
            data: updatedSingleHorse,
          }
        });
      } else {
        res.status(404).json({
          success: false, 
          response: {
            message: "Could not update the horse",
          } 
        })
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while trying to update the horse"
      })
    }
  })

// DELETE single horse
router.delete("/horses/:horseId", authenticateUser, async (req, res) => {
  const { horseId } = req.params;

  try {

    const deleteHorse = await Horse.findByIdAndDelete(horseId)

    if (deleteHorse) {
      res.status(201).json({
        success: true, 
        response: {
          message: "Successfully deleted horse",
      } 
      })
    } else {
      res.status(404).json({
        success: false, 
        response: {
          message: "Horse could not be deleted",
      } 
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false, 
      response: error, 
      message: "An error occurred while trying to delete a horse"
    });
  }
})

// MAJA AND SANDRA - DON'T DELETE THIS COMMENTS or any OUTCOMMENTED CODE BELOW FOR NOW!
// Might do more with this before cleaning up the code in the end of the process :) 
// PATCH to add a new show for a single horse - to be managed later and also might be moved to the venues section
// not sure at the moment /YK
router.patch("/horses/:horseId/squares", authenticateUser, async (req, res) => {
  const { horseId } = req.params;

  try {
    // Get the horse id from the request parameters
    // const { squareComment, squareStars } = req.body;
    // const { squareIcon, squareName, squarePhotoRef, squareRating, squareVicinity } = req.body;

    // Find the horse by its id and update it to add a new square to the square array in the frontend
    // I saw something about the $push operator but need to look more into that /YK
    const updatedHorse = await Horse.findByIdAndUpdate(
      horseId,
      { $push: { squares: {} } },
      { new: true } // To return the updated horse data
    );
    if (updatedHorse) {
      res.status(200).json({
        success: true,
        response: {
          message: "Square successfully added to horse",
          data: updatedHorse,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        response: {
          message: "Square could not be added to the horse",
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "An error occurred while adding the square to the horse",
    });
  }
});

  
// PATCH to add and change comments and stars of a single square for the unique horse (by horseId)
router.patch("/horses/:horseId/squares/:squareId", authenticateUser, async (req, res) => {
  const { horseId, squareId } = req.params; // Get the user id from the request parameters

  try {
    const { squareComment, squareStars } = req.body; 

    const horse = await Horse.findById(horseId);

    if (!horse) {
      return res.status(404).json({
        success: false,
        message: "Horse could not be found",
      });
    }

    const updateSquare = horse.squares.id(squareId);

    if (!updateSquare) {
      return res.status(404).json({
        success: false,
        message: "Square could not be found",
      });
    }

      updateSquare.squareComment = squareComment;
      updateSquare.squareStars = squareStars;

      await horse.save()
    
      res.status(200).json({
        success: true,
        response: {
          message: "Square successfully updated",
          data: updateSquare,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "An error occurred while updating the square",
      });
    }
  });


// DELETE single square in a Horse's array of Squares
router.delete("/horses/:horseId/squares/:squareId", authenticateUser, async (req, res) => {
  const { horseId, squareId } = req.params;

  try {
    const horse = await Horse.findById(horseId);

    if (!horse) {
      return res.status(404).json({
        success: false,
        message: "Horse could not be found",
      });
    }

    const square = horse.square.id(squareId);

    if (!square) {
      return res.status(404).json({
        success: false,
        message: "Square could not be found",
      });
    }

    await Horse.findByIdAndUpdate(
      horseId, 
      { $pull: { squares: { _id: squareId } } }, 
      { new: true }
    ); 

      res.status(200).json({
        success: true, 
        response: {
          message: "Successfully deleted square",
      } 
    })
  } catch (error) {
    res.status(500).json({
      success: false, 
      response: error, 
      message: "An error occurred while trying to delete a square"
    });
  }
})
  
export default router;