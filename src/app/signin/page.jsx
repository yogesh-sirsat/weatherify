"use client";

import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import axiosConfig from "@/config/axiosConfig";
import Cookies from "js-cookie";
import LoadingScreen from "@/components/LoadingScreen";
import manageAlerts from "@/utils/manageAlerts";

function SignIn() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/signin`;
  const requestScope = "playlist-modify-private playlist-modify-public user-read-recently-played user-top-read";

  const generateRandomString = (length) => {
    let string = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      string += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return string;
  };

  const generateCodeChallenge = async (codeVerifier) => {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
  
    return base64encode(digest);
  }

  const saveUserProfile = async (data, refresh_token) => {
    try {
      const user_data = {
        id: data.id,
        name: data.display_name,
        image64: data.images[0].url,
        image300: data.images[1].url,
        spotify: data.external_urls.spotify,
        api: data.href,
        refresh_token: refresh_token
      }
      localStorage.setItem(data.id, JSON.stringify(user_data));
      await axiosConfig.post('mongodb/user', {
          id: data.id,
          name: data.display_name,
          image64: data.images[0].url,
          image300: data.images[1].url,
          spotify: data.external_urls.spotify,
          api: data.href,
          refresh_token: refresh_token
      });
    } catch (error) {
      console.log('Error saving profile:', error);
    }
  }

  const getUserProfile = async (access_token, refresh_token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + access_token
        }
      });

      console.log(response);
      Cookies.set('user_id', response.data.id, {
        expires: 365,
        sameSite: 'strict',
        secure: process.env.NEXT_PUBLIC_SECURE_COOKIE
      });
      await saveUserProfile(response.data, refresh_token);
    } catch (error) {
      console.log('Error getting profile:', error);
      manageAlerts(setError, 'Error getting profile');
    }
  }
  
  const manageTokens = async (access_token, refresh_token, expires_in) => {
    // Setting access token expirty time 6 minutes before real expiry time
    const access_token_expires_at = new Date(Date.now() + (expires_in - 360) * 1000);
    Cookies.set('access_token', access_token, {
      expires: access_token_expires_at,
      sameSite: 'strict',
      secure: process.env.NEXT_PUBLIC_SECURE_COOKIE
    });
    Cookies.set('refresh_token', refresh_token, {
      expires: 180,
      sameSite: 'strict',
      secure: process.env.NEXT_PUBLIC_SECURE_COOKIE
    });

    await getUserProfile(access_token, refresh_token);
  } 

  const requestTokens = async (code) => {
    try {
      const codeVerifier = localStorage.getItem('code_verifier');
      if (!codeVerifier) {
        console.log('Code verifier not found in local storage');
        manageAlerts(setError, 'Authorization error, signin again');
      }
  
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier
      });
  
      const response = await axios.post('https://accounts.spotify.com/api/token', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });
  
      console.log(response);
        
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in, scope } = response.data;
        console.log(access_token, refresh_token, expires_in, scope);
        await manageTokens(access_token, refresh_token, expires_in);
        if (requestScope !== scope) {
          console.log('Scope mismatch');
        }
        return;
      } else {
        console.error(response.data.error);
        manageAlerts(setError, 'Authorization error');
      }
  
    } catch (error) {
      console.error(error);
      manageAlerts(setError, 'Authorization error');
    }
  }
  

  const handleGetStarted = () => {
    if (Cookies.get('refresh_token')) {
      return router.push('/');
    }
    const codeVerifier = generateRandomString(128);

    generateCodeChallenge(codeVerifier).then(codeChallenge => {
      const state = generateRandomString(16);

      localStorage.setItem('code_state', state);
      localStorage.setItem('code_verifier', codeVerifier);

      const args = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: requestScope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
      });

      window.location = 'https://accounts.spotify.com/authorize?' + args;
    });
  };

  const manageSpotifyCallback = async (search_params) => {
    setLoading(true);
    // Check for errors or handle the received data
    if (localStorage.getItem('code_state') !== search_params.get("state")) {
      console.error('Invalid state');
      manageAlerts(setError, 'Invalid request, try again');
    } else if (search_params.has("error")) {
      console.error('Authorization error:', search_params.get("error"));
      manageAlerts(setError, 'Authorization error');
    } else if (search_params.has("code")) {
      await requestTokens(search_params.get("code"));
      return router.push('/');
    } else {
      manageAlerts(setError, 'Unknown error occurred, try again');
    }
    router.push('/signin');
  }

  useEffect(() => {
    const search_params = new URLSearchParams(window.location.search);
    console.log('searchParams', search_params);
    if (search_params.has("state")) {
      manageSpotifyCallback(search_params);
    }
  }, [])
  
  return (
    <>
    {loading ? <LoadingScreen /> : null}
    <main className="container mx-auto relative">
      {error ? (
      <div className="bg-error flex flex-row gap-2 rounded-2xl absolute p-6 top-0 inset-x-0 m-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
      ): null}
      <section className="flex flex-row min-h-screen justify-start items-center p-4">
        <div className="max-w-lg md:max-w-2xl">
          <h1 className="text-5xl md:text-9xl font-bold">Weatherify</h1>
          <p className="py-6">
            Create personalized playlists in your Spotify, that sync with your
            current time of day, weather, and recent taste. Explore the magic of
            music and weather coming together for a unique listening
            experience.
          </p>
          <button className="btn btn-primary" onClick={handleGetStarted}>Let's Create</button>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
};

export default SignIn;
