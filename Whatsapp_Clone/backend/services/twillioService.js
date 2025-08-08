const twilio=require('twilio');

const accountSid=process.env.TWILLIO_ACCOUNT_SID;
const serviceSid=process.env.TWILLIO_SERVICE_SID;
const authToken=process.env.TWILLIO_AUTH_TOKEN;

const client=twilio(accountSid,authToken);

const sendOtpToPhoneNumber=async(phoneNumber)=>{
    try {
        console.log("sending Otp to this number :",phoneNumber);
        if(!phoneNumber){
            throw new Error('Phone Numer is Required ');
        }

        const response=await client.verify.v2.services(serviceSid).verifications.create({
            to:phoneNumber,
            channel:'sms'
        });
        console.log("This is My OTP Response..",response);
        return response;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to send to otp..');
    }
};

const verifyOtp=async(phoneNumber,otp)=>{
    try {
        console.log("OTP :",otp);
        console.log("Mobile Number :",phoneNumber);
        const response=await client.verify.v2.services(serviceSid).verificationChecks.create({
            to:phoneNumber,
            code:otp,
        });
        console.log("OTP Response :",response);
        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to verify OTP..!");
    }
};

module.exports={sendOtpToPhoneNumber,verifyOtp};
