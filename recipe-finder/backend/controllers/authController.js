const User = require("../models/User");
const {
  hashPassword,
  verifyPassword,
  createToken: signToken,
  decodeJwtPayload,
} = require("../utils/authUtils");

const JWT_SECRET = process.env.JWT_SECRET || "recipe-finder-development-secret";

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const getRoleForEmail = (email) =>
  getAdminEmails().includes(email.toLowerCase()) ? "admin" : "customer";

const buildToken = (user) =>
  signToken(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET
  );

const buildAuthResponse = (user) => ({
  token: buildToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    role: user.role,
    fullname: user.fullname || "",
    age: user.age || null,
    country: user.country || "",
    sex: user.sex || "",
  },
});

const emailLogin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const passwordHash = hashPassword(password);
      user = await User.create({
        email: normalizedEmail,
        name: name?.trim() || normalizedEmail.split("@")[0],
        passwordHash,
        authProviders: ["local"],
        role: getRoleForEmail(normalizedEmail),
      });

      return res.status(200).json(buildAuthResponse(user));
    }

    if (!user.passwordHash) {
      user.passwordHash = hashPassword(password);
      if (!user.authProviders.includes("local")) {
        user.authProviders.push("local");
      }
      await user.save();
      return res.status(200).json(buildAuthResponse(user));
    }

    const passwordMatches = verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json(buildAuthResponse(user));
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const payload = decodeJwtPayload(credential);
    const email = payload?.email?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Google account email is missing" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name: payload?.name || email.split("@")[0],
        picture: payload?.picture || "",
        authProviders: ["google"],
        role: getRoleForEmail(email),
      });
    } else {
      user.name = payload?.name || user.name;
      user.picture = payload?.picture || user.picture;
      if (!user.authProviders.includes("google")) {
        user.authProviders.push("google");
      }
      await user.save();
    }

    return res.status(200).json(buildAuthResponse(user));
  } catch (error) {
    return res.status(401).json({ message: "Google login failed", error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email picture role fullname age country sex");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        fullname: user.fullname || "",
        age: user.age || null,
        country: user.country || "",
        sex: user.sex || "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullname, age, country, sex } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = fullname?.trim() || user.name;
    user.fullname = fullname !== undefined ? fullname.trim() : user.fullname;
    user.age = age !== undefined ? (age === "" ? null : Number(age)) : user.age;
    user.country = country !== undefined ? country.trim() : user.country;
    user.sex = sex !== undefined ? sex : user.sex;

    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        fullname: user.fullname,
        age: user.age,
        country: user.country,
        sex: user.sex,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  emailLogin,
  googleLogin,
  me,
  updateProfile,
};