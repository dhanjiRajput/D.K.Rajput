const response = require('../utils/responseHandler');
const otpGenerator = require('../utils/otpGenerator');
const User = require('../models/userModel');
const sendOtpToEmail = require('../services/emailService');
const { sendOtpToPhoneNumber, verifyOtp } = require('../services/twillioService');
const generateToken = require('../utils/generateToken');
const { uplodFileToCloudinary } = require('../config/cloudinary');
const Conversation = require('../models/conversationModel');

// ========== SEND OTP ==========
const sendOtp = async (req, res) => {
  try {
    const { phoneNumber, phoneSuffix, email } = req.body;
    const otp = otpGenerator(); // Generate 6-digit OTP
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes
    let user;

    // Handle email-based OTP
    if (email) {
      user = await User.findOne({ email });
      if (!user) user = new User({ email });

      user.emailOtp = otp;
      user.emailOtpExpiry = expiry;

      console.log("OTP:", otp);
      await user.save();
      await sendOtpToEmail(email, otp); // Send OTP via email

      return response(res, 200, 'OTP sent successfully.', { email });
    }

    // Handle phone-based OTP
    if (!phoneNumber || !phoneSuffix) {
      return response(res, 400, 'Phone number and suffix are required.');
    }

    const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
    user = await User.findOne({ phoneNumber });
    if (!user) user = new User({ phoneNumber, phoneSuffix });

    await sendOtpToPhoneNumber(fullPhoneNumber); // Send OTP via Twilio
    await user.save();

    return response(res, 200, 'OTP sent successfully.', user);
  } catch (error) {
    console.error('sendOtp error:', error);
    return response(res, 500, 'Internal server error');
  }
};

// ========== VERIFY OTP ==========
const verifiedOtp = async (req, res) => {
  const { phoneNumber, phoneSuffix, email, otp } = req.body;
  let user;

  try {
    if (email) {
      user = await User.findOne({ email });
      if (!user) return response(res, 404, 'User not found.');

      const now = new Date();

      // Validate OTP
      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        now > new Date(user.emailOtpExpiry)
      ) {
        return response(res, 404, 'Invalid or expired OTP.');
      }

      // Mark email as verified
      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;
      await user.save();
    } else {
      // Validate phone-based OTP
      if (!phoneNumber || !phoneSuffix) {
        return response(res, 404, 'Phone number and suffix are required.');
      }

      const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
      user = await User.findOne({ phoneNumber });
      if (!user) return response(res, 404, 'User not found.');

      const result = await verifyOtp(fullPhoneNumber, otp);
      if (result.status !== 'approved') {
        return response(res, 404, 'Invalid OTP');
      }

      user.isVerified = true;
      await user.save();
    }

    // Generate JWT token and set it in cookie
    const token = generateToken(user?._id);
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });

    return response(res, 200, 'OTP verified successfully.', { token, user });
  } catch (error) {
    console.error(error);
    return response(res, 500, 'Internal server error.');
  }
};

// ========== UPDATE PROFILE ==========
const updateProfile = async (req, res) => {
  const { username, agreed, about } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    const file = req.file;

    // Upload profile picture if file is provided
    if (file) {
      const uploadResult = await uplodFileToCloudinary(file);
      user.profilePicture = uploadResult?.secure_url;
    } else if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }

    // Update profile fields if provided
    if (username) user.username = username;
    if (agreed) user.agreed = agreed;
    if (about) user.about = about;

    await user.save();

    return response(res, 200, 'User profile updated successfully.', user);
  } catch (error) {
    console.error(error);
    return response(res, 500, 'Internal server error.');
  }
};

// ========== LOGOUT ==========
const logout = (req, res) => {
  try {
    res.clearCookie('auth_token'); // Clear JWT cookie
    return response(res, 200, 'User logged out successfully.');
  } catch (error) {
    console.error(error);
    return response(res, 500, 'Internal server error.');
  }
};

// ========== CHECK AUTHENTICATION ==========
const checkAuthenticated = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return response(res, 404, 'Unauthorized. Please log in.');
    }

    const user = await User.findById(userId);
    if (!user) {
      return response(res, 404, 'User not found.');
    }

    return response(res, 200, 'User authenticated successfully.', user);
  } catch (error) {
    console.error(error);
    return response(res, 500, 'Internal server error.');
  }
};

// ========== GET ALL USERS EXCEPT LOGGED-IN USER ==========
const getAllUsers = async (req, res) => {
  const loggedInUser = req.user.userId;
  console.log('Logged In User:', loggedInUser);

  try {
    // Find all users except the logged-in one
    const users = await User.find({ _id: { $ne: loggedInUser } })
      .select('username profilePicture lastSeen isOnline about phoneNumber phoneSuffix')
      .lean();

    console.log('Users:', users);

    // Attach conversation info with each user
    const userWithConversation = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [loggedInUser, user?._id] }
        })
          .populate({
            path: 'lastMessage',
            select: 'content createdAt sender receiver'
          })
          .lean();

        return {
          ...user,
          conversation: conversation || null
        };
      })
    );

    return response(res, 200, 'Users retrieved successfully.', userWithConversation);
  } catch (error) {
    console.error(error);
    return response(res, 500, 'Internal server error.');
  }
};

module.exports = {
  sendOtp,
  verifiedOtp,
  updateProfile,
  logout,
  checkAuthenticated,
  getAllUsers
};
