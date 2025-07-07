var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Webhook } from 'svix';
import User from '../models/userModel.js';
const clerkWebHooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Create a svix instance  with clerk webhook secret
        const secret = process.env.CLERK_WEBHOOK_SECRET;
        if (!secret) {
            throw new Error("CLERK_WEBHOOK_SECRET environment variable is not set");
        }
        const whook = new Webhook(secret);
        //Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };
        //Verifying Headers
        yield whook.verify(JSON.stringify(req.body), headers);
        //Getting Data from request body
        const { data, type } = req.body;
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        };
        //Switch Case for different events
        switch (type) {
            case "user.created": {
                yield User.create(userData);
                break;
            }
            case "user.updated": {
                yield User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted": {
                yield User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
        }
        res.json({ success: true, message: "Webhook Recieved.." });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.json({ success: false, message: error.message });
        }
        else {
            console.log(error);
            res.json({ success: false, message: String(error) });
        }
    }
});
export default clerkWebHooks;
