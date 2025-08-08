import axiosInstance from "./url.service";

export const sentOtp=async(phoneNumber,phoneSiffix,email)=>{
    try {
        const response=await axiosInstance.post("/auth/send-otp",{phoneNumber,phoneSiffix,email});
        // console.log("Send OTP From Frontside :",response.data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


export const verifyOtp=async(phoneNumber,phoneSiffix,otp,email)=>{
    try {
        const response=await axiosInstance.post("/auth/verify-otp",{phoneNumber,phoneSiffix,otp,email});
        // console.log("Verify OTP From Frontside :",response.data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


export const updateUserProfile=async(updateData)=>{
    try {
        const response=await axiosInstance.put("/auth/update-profile",updateData);
        // console.log("update Profile From Frontside :",response.data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


export const checkUserAuth=async()=>{
    try {
        const response=await axiosInstance.get("/auth/check-auth");
        // console.log("Authentication data From Frontside :",response.data);
        if(response.data.status === "success"){
            return {isAuthenticated:true,user:response?.data?.data}
        }else if(response.data.status === "error"){
            return {isAuthenticated:false}
        }
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


export const logoutUser=async()=>{
    try {
        const response=await axiosInstance.get("/auth/logout");
        // console.log("logout Profile From Frontside :",response.data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};


export const getAllUsers=async()=>{
    try {
        const response=await axiosInstance.get("/auth/users");
        // console.log("uGet All Users From Frontside :",response.data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

