import './models/user.model.js'
import bcrypt from 'bcryptjs'
import User from './models/user.model.js';
import jwt from 'jsonwebtoken';
import Quote from './models/quotes.model.js';
import dotenv from 'dotenv';

dotenv.config();

const resolvers = {
    User: {
        quotes: async (ur) => await Quote.find({ by: ur._id })
    },

    Query: {
        users: async () => await User.find({}),
        user: async (_, { _id }) => await User.findOne({ _id }),
        quotes: async () => await Quote.find({}).populate("by", "_id firstName"),
        iquote: async (_, { by }) => await Quote.find({ by }),
        myprofile: async (_, args, { userId }) => {
            if (!userId) throw new Error("You Must be Logged In");
            return await User.findOne({ _id: userId })
        }
    },

    Mutation: {
        //Create New User
        signupUser: async (_, { signup_User }) => {
            const user = await User.findOne({ email: signup_User.email });
            if (user) {
                throw new Error("User Already Exist... ")
            }

            const hashedPassword = await bcrypt.hash(signup_User.password, 10);

            const newuser = await User.create({
                ...signup_User,
                password: hashedPassword
            });
            return await newuser.save();
        },

        //Login existing User(Authentication)
        signinUser: async (_, { signin_User }) => {
            const user = await User.findOne({ email: signin_User.email });
            if (!user) {
                throw new Error("User Not Found... ");
            }

            const matchedPassword = await bcrypt.compare(signin_User.password, user.password);
            if (!matchedPassword) {
                throw new Error("Invalid Password....");
            }

            const token = jwt.sign({ userId: user._id }, process.env.jwt_key);
            return { token }
        },


        //Create New Quotes
        createQuote: async (_, { name }, { userId }) => {
            if (!userId) {
                throw new Error("You Must Logged in");
            }

            const quote = await Quote.create({
                name,
                by: userId
            });

            await quote.save();
            return "Quote Created Sucessfully"
        },

        deleteQuote: async (_, { _id }, { userId }) => {
            console.log("Deleting quote with ID:", _id);
            if (!userId) throw new Error("Authentication required");
            const quote = await Quote.findById(_id);
            if (!quote) throw new Error("Quote not found");
            if (quote.by.toString() !== userId) throw new Error("Unauthorized");

            await Quote.findByIdAndDelete(_id);
            return "Quote deleted successfully";
        },

        updateQuote: async (_, { _id, name }, { userId }) => {
            console.log("Updating quote with ID:", _id, "to:", name);
            if (!userId) throw new Error("Authentication required");
            const quote = await Quote.findById(_id);
            if (!quote) throw new Error("Quote not found");
            if (quote.by.toString() !== userId) throw new Error("Unauthorized");

            quote.name = name;
            await quote.save();
            return "Quote updated successfully";
        }
    }
};

export default resolvers;