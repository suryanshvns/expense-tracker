import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";


const passportConfig = async() => {
    passport.serializeUser((user, done) => {
        console.log("serialized user")
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        console.log("deserialized user");
        try{
            const user = await User.findById(id);
            done(null, user);
        } catch(err){
            done(err);
        }
    });

    passport.use(
        new GraphQLLocalStrategy (async(username, password, done) => {
            try{
                const user = await User.findOne({username});
                if(!user){
                    throw new Error("Invalid username or password")
                }
                const validPassword = await bcrypt.compare(password, user.password);
                if(!validPassword){
                    throw new Error("Invalid username or password")
                }
                return done(null, user);
            } catch(err){
                done(err);
            }
        })
    )
}

export default passportConfig;
