import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Mutation: {
    signUp: async (_, arg, context) => {


      try {
        const {
          input: { username, name, password, gender },
        } = arg;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }
        const existingUser = await User.findOne({username});
        if (existingUser) {
          throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (err) {
        console.log("Error in signup", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },

    login: async (_, input, context) => {
      try {
        const { username, password } = input;
        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (err) {
        console.log("Error in login", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout();
        req.sesion.destroy((err) => {
          if (err) throw err;
        });
        res.clearCookies("connect.sid");
        return { message: "Successfully logged out" };
      } catch {
        console.log("Error in logout", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
  },
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.log("Error in authUser", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.log("Error in user query", err);
        throw new Error(err.message || "Error in getting user");
      }
    },
  },
};

export default userResolver;
