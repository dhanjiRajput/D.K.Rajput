import { useParams } from "react-router-dom";
import Profile from "./Profile";
import OtherUserProfile from "./OtherUserProfile";

const ProfileSwitcher = () => {
  const token = localStorage.getItem("token");
  const { userid } = useParams();

  return token ? <Profile /> : <OtherUserProfile userid={userid} />;
};

export default ProfileSwitcher;
