import stripe from "stripe";
import Booking from "../models/BookingModel.js";

//API to handle Stripe webhooks

export const stripeWebhooks=async(req,res)=>{
    //Stripe Gateway Initialize
    const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);
    const sign=req.headers['stripe-signature'];
    let event;

    try {
        event=stripeInstance.webhooks.constructEvent(req.body,sign,process.env.STRIPE_WEBHOOK_KEY);
    } catch (error) {
        res.status(400).send(`Webhook Error :${error.message}`);
    }

    //Handle the event
    if(event.type==='payment_intent.succeeded'){
        const paymentIntent=event.data.object;
        const paymentIntentId=paymentIntent.id;

        //Getting session MetaData
        const session=await stripeInstance.checkout.sessions.list({
            payment_intent:paymentIntentId,
        });

        const {bookingId}=session.data[0].metadata;

        //Mark payment is Paid
        await Booking.findByIdAndUpdate(bookingId,{isPaid:true,paymentMethod:"Stripe"});
    }else{
        console.log("Unhandled Event Type :",event.type);
    }
    res.json({received:true});
}