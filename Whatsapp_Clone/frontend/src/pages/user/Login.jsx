import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import useLoginStore from '../../store/useLoginStore'
import countries from '../../utils/Countries';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import userUserStore from '../../store/useUserStore';
import { useForm } from 'react-hook-form';

//validation Schema
const loginValidationSchema = yup.object().shape({
    phoneNumber: yup.string().nullable().notRequired().matches(/^\d+$/, "Phone Number Must be Digit").transform((value, originalValue) =>{
      originalValue.trim() === "" ? null : value
    }),
    email: yup.string().nullable().notRequired().email("Please Enter Valid email").transform((value, originalValue) =>{
      originalValue.trim() === "" ? null : value
    }).test(
      "at-least",
      "Either email or Phone Number",
      function(value){
        return !!(value.phoneNumber || value.email)
      }
    )
});


const otpValidationSchema = yup.object().shape({
  otp:yup.string().length(6,"otp must be exactly 6 digits").required("OTP is Required")
});

const profileValidationSchema = yup.object().shape({
  username:yup.string().required("OTP is Required"),
  agreed:yup.bool().oneOf([true],"You Must Agree to the terms")
});


  const avatars = [
  'https://api.dicebear.com/6.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/6.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/6.x/avataaars/svg?seed=Mimi',
  'https://api.dicebear.com/6.x/avataaars/svg?seed=Jasper',
  'https://api.dicebear.com/6.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/6.x/avataaars/svg?seed=Zoe',
]


const Login = () => {
  const { step, setStep, userPhoneData, setUserPhoneData, resetLoginState } = useLoginStore();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [profilePicture,setProfilePicture]=useState(null);
  const [profilePictureFile,setProfilePictureFile]=useState(null);
  const [selectedAvatar,setSelectedAvatar]=useState(avatars[0]);
  const [error,setError]=useState("");
  
  const navigate=useNavigate();
  const {setUser}=userUserStore();

  const {
    register:loginRegister,
    handleSubmit:handleLoginSubmit,
    formState:{error:loginErrors}
  }=useForm({
    resolver:yupResolver(loginValidationSchema)
  });

  return (
    <div>Login</div>
  )
}

export default Login