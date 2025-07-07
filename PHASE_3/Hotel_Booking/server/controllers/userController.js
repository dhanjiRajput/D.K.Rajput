//Get User Data  /api/user
export const getUserData=async(req,res)=>{
    try {
        const role=req.user.role;
        const recentSearchCitiies=req.user.recentSearchCitiies;
        res.json({success:true,role,recentSearchCitiies});
    } catch (error) {
        res.json({success:false,message:error.message})
    }
};

//Store User Recent Searched Cities
export const storeRecentSearchCitiies=async(req,res)=>{
    try {
        const {recentSearchCitiies}=req.body;
        const user=await req.user;

        if(user.recentSearchCitiies.length < 3){
            user.recentSearchCitiies.push(recentSearchCitiies);
        }else{
            user.recentSearchCitiies.shift();
            user.recentSearchCitiies.push(recentSearchCitiies);
        }
        await user.save();
        res.json({success:true,message:"City Added"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}