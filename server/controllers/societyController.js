const Society = require("../models/Society");
const User = require("../models/User");

// Initialize society if it doesn't exist
const initializeSociety = async () => {
  let society = await Society.findOne();
  if (!society) {
    society = await Society.create({});
  }
  return society;
};

exports.getSocietyConfig = async (req, res) => {
  try {
    let society = await initializeSociety();
    
    // Calculate dynamic fields
    // 1. Occupied Flats: Count unique users (residents) who have a flatNo
    const users = await User.find({ role: { $ne: "admin" } });
    
    const occupiedFlats = new Set();
    let totalResidents = users.length; // Count the primary users
    
    users.forEach(user => {
      if (user.flatNo) {
        occupiedFlats.add(user.flatNo);
      }
      if (user.familyMembersCount) {
        totalResidents += user.familyMembersCount;
      }
    });

    const numOccupiedFlats = occupiedFlats.size;
    const vacantFlats = Math.max(0, society.totalFlats - numOccupiedFlats);

    res.status(200).json({
      success: true,
      data: {
        ...society.toObject(),
        occupiedFlats: numOccupiedFlats,
        vacantFlats,
        totalResidents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateSocietyConfig = async (req, res) => {
  try {
    let society = await initializeSociety();

    const updatedData = {
      societyName: req.body.societyName,
      logo: req.body.logo,
      address: req.body.address,
      contactNumber: req.body.contactNumber,
      contactEmail: req.body.contactEmail,
      totalWings: req.body.totalWings,
      totalFloors: req.body.totalFloors,
      totalFlats: req.body.totalFlats,
      maintenanceAmount: req.body.maintenanceAmount,
      maintenanceDueDay: req.body.maintenanceDueDay,
      emergencyContact: req.body.emergencyContact,
      securityContact: req.body.securityContact,
      officeTiming: req.body.officeTiming
    };

    // Remove undefined values
    Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

    society = await Society.findByIdAndUpdate(society._id, updatedData, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: "Society settings updated successfully",
      data: society
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
