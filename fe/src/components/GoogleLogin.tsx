import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { setUserProfile } from '@/data/functions';

const GoogleLoginButton = ({ onClose }: { onClose: () => void }) => {
  const handleGoogleSuccess = async (response: any) => {
    const token = response.credential;

    if (token) {
      try {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/users/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        response = await response.json();
        setUserProfile(response.data);
        onClose(); 
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    } else {
      console.error('No credential received');
    }
  };

  const handleGoogleError = (error: any) => {
    console.log('Google login error:', error);
  };

  return (
    <div>
      <GoogleOAuthProvider clientId="545362908623-funr640u1caveqkvrcv9jnvr50j7cj6d.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleError}
          scope="email profile"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginButton;