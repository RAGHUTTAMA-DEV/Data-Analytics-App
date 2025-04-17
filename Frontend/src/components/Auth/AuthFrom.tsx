import React, { useState } from 'react';    
import SignIn from './SignIn';
import SignUp from './SignUp';

interface AuthFromProps {
  type: 'signin' | 'signup';
}

const AuthFrom: React.FC<AuthFromProps> = ({ type }) => {
    return type==='signin'?<SignIn/>:<SignUp/>
}

export default AuthFrom;