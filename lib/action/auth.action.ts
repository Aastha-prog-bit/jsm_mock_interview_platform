
'use server';

import { db, auth } from "@/FireBase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

// Defining types for clarity
interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface SignInParams {
  email: string;
  idToken: string;
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
  try {

    const userRecord = await db.collection('users').doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: 'User already exists. Please sign in instead.'
      };
    }

    // FIXED: Removed .get() before .set()
    await db.collection('users').doc(uid).set({
      name,
      email,

    });


    return {
      success: true,
      message: 'Account created successfully.Please sign in instead.'
    };
  } catch (e: any) {
    console.error('Error creating a user:', e);
    if(e.code == 'auth/email-already-exists') {
      return{
        success: false,
        message:"This email is already in use."
      }
    }
    return{
      success: false,
      message: " Failed to create an account."
    }
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: 'User does not exist. Create an account instead.'
      };
    }

    await setSessionCookie(idToken);

    // FIXED: Added return statement for success
    // return {
    //   success: true,
    //   message: 'Logged in successfully.'
    // };
  } catch (e: any) {
    console.error(e);
    return {
      success: false,
      message: 'Failed to log into an account.'
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Firebase expects milliseconds for expiresIn
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax'
  });
}