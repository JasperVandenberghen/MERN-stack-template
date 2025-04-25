import { EmailAuthProvider, linkWithCredential } from 'firebase/auth';

import { signInWithGoogle } from '../services/firebase';

export const handleGoogleSignIn = async (
  passwordDialog,
  setGoogleErrorMessage,
) => {
  try {
    const { user, idToken } = await signInWithGoogle();

    const isPasswordProvider = user?.providerData.some(
      (profile) => profile.providerId === 'password',
    );

    // Also creates an account if credentials account does not exist yet
    // and if one exists, it will overwrite it with the entered password
    if (!isPasswordProvider) {
      console.log('Attempting to link google account with email/password...');

      const pw = await passwordDialog.invoke({
        title: 'Set or update your password',
        description: `If you already have an account with this email address using a password, 
        the password will be updated to the one you enter here.`,
      });

      if (pw) {
        const emailCredential = EmailAuthProvider.credential(user?.email, pw);
        await linkWithCredential(user, emailCredential);
        console.log('Google account linked with email/password!');
      } else {
        setGoogleErrorMessage('A password is required to login with Google.');
        return { error: 'A password is required to login with Google.' };
      }
    }

    const googleToken = await user?.getIdToken();

    return { user, idToken, googleToken };
  } catch (error) {
    return { error: error.message };
  }
};
