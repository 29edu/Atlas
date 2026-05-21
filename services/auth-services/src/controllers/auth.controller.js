import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// Function to generate JWT token
// Generate fution
const generateToken = (userId, email, role) => {
  return jwt.sign({ id: userId, email: email, role }, JWT_SECRET, {  // Return json token string
    expiresIn: "1h",
  });
} 

const signUp = async (req, res) => {
  const { firstName, lastName, email, password} = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid  Input",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User Already Exist",
      });
    }

    const saltRound = 10;
    // const myPlaintextPassword = 's0/\/\p4$$w0rD';

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, saltRound); // contains the hashed password

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id, email, newUser.role);

    res.status(201).json({ // 201 code because it is created. 200 means OK
      success: true,
      message: "User Created Successfully",
      data:  {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
        token: token, // sending token to frontend
      }
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      // Validaion Error due to constraints on the schema
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Found some error in the auth controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: true,
        message: "Invalid Email or Password",
      });
    }

    // compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Token Generation
    const token = generateToken(user._id, email, user.role);

    // send token
    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token: token
      }
    });
  } catch (error) {
    console.log("Error in the login controller", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { signUp, login };
