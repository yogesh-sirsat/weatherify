"use client";

import React, { useEffect, useState, useRef, FC } from "react";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import axios from "axios";
import axiosConfig from "@/config/axiosConfig";
import Cookies from "js-cookie";
import LoadingScreen from "@/components/LoadingScreen";
import manageAlerts from "@/utils/manageAlerts";

const SignIn: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
  const rawBaseUrl = (
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000"
  ).replace(/\/+$/, "");
  // Spotify policy requirement: localhost is forbidden. Must use 127.0.0.1 literal.
  const baseUrl = rawBaseUrl.replace(/\/\/localhost(?::|$)/, (match) =>
    match.replace("localhost", "127.0.0.1")
  );
  const redirectUri = `${baseUrl}/signin`;
  const requestScope =
    "playlist-modify-private playlist-modify-public user-read-recently-played user-top-read";

  const generateRandomString = (length: number): string => {
    let string = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      string += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return string;
  };

  const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
    function base64encode(buffer: ArrayBuffer): string {
      return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    return base64encode(digest);
  };

  const saveUserProfile = async (data: any, refresh_token: string): Promise<void> => {
    try {
      const user_data = {
        id: data.id,
        name: data.display_name,
        image64: data.images?.[0]?.url,
        image300: data.images?.[1]?.url,
        spotify: data.external_urls?.spotify,
        api: data.href,
        refresh_token: refresh_token,
      };
      localStorage.setItem(data.id, JSON.stringify(user_data));
      await axiosConfig.post("mongodb/user", {
        id: data.id,
        name: data.display_name,
        image64: data.images?.[0]?.url,
        image300: data.images?.[1]?.url,
        spotify: data.external_urls?.spotify,
        api: data.href,
        refresh_token: refresh_token,
      });
    } catch (err) {
      console.log("Error saving profile:", err);
    }
  };

  const getUserProfile = async (
    access_token: string,
    refresh_token: string
  ): Promise<void> => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      });

      console.log(response);
      Cookies.set("user_id", response.data.id, {
        expires: 365,
        sameSite: "strict",
        secure: Boolean(process.env.NEXT_PUBLIC_SECURE_COOKIE),
      });
      await saveUserProfile(response.data, refresh_token);
    } catch (err) {
      console.log("Error getting profile:", err);
      manageAlerts(setError, "Error getting profile");
    }
  };

  const manageTokens = async (
    access_token: string,
    refresh_token: string,
    expires_in: number
  ): Promise<void> => {
    // Setting access token expiry time 6 minutes before real expiry time
    const access_token_expires_at = new Date(
      Date.now() + (expires_in - 360) * 1000
    );
    Cookies.set("access_token", access_token, {
      expires: access_token_expires_at,
      sameSite: "strict",
      secure: Boolean(process.env.NEXT_PUBLIC_SECURE_COOKIE),
    });
    Cookies.set("refresh_token", refresh_token, {
      expires: 180,
      sameSite: "strict",
      secure: Boolean(process.env.NEXT_PUBLIC_SECURE_COOKIE),
    });

    await getUserProfile(access_token, refresh_token);
  };

  const hasHandledCallback = useRef(false);

  const requestTokens = async (code: string): Promise<boolean> => {
    try {
      const codeVerifier = localStorage.getItem("code_verifier");
      if (!codeVerifier) {
        console.error("Code verifier not found in localStorage");
        manageAlerts(setError, "Authorization session expired, please sign in again");
        return false;
      }

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      });

      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200 && response.data?.access_token) {
        const { access_token, refresh_token, expires_in, scope } =
          response.data;
        await manageTokens(access_token, refresh_token, expires_in);
        if (requestScope !== scope) {
          console.warn("Scope mismatch:", { expected: requestScope, received: scope });
        }
        return true;
      } else {
        console.error("Token error:", response.data);
        manageAlerts(setError, "Failed to authenticate with Spotify");
        return false;
      }
    } catch (err: any) {
      console.error("Token exchange failed:", err?.response?.data || err);
      const desc = err?.response?.data?.error_description || "Authorization error occurred";
      manageAlerts(setError, desc);
      return false;
    }
  };

  const handleGetStarted = () => {
    if (Cookies.get("refresh_token")) {
      return router.push("/");
    }
    const codeVerifier = generateRandomString(128);

    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      const state = generateRandomString(16);

      localStorage.setItem("code_state", state);
      localStorage.setItem("code_verifier", codeVerifier);

      const args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: requestScope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      window.location.href = "https://accounts.spotify.com/authorize?" + args.toString();
    });
  };

  const manageSpotifyCallback = async (
    search_params: URLSearchParams
  ): Promise<void> => {
    setLoading(true);
    try {
      const stateParam = search_params.get("state");
      const storedState = localStorage.getItem("code_state");

      if (search_params.has("error")) {
        console.error("Authorization error from Spotify:", search_params.get("error"));
        manageAlerts(setError, "Authorization cancelled or denied");
        setLoading(false);
        router.replace("/signin");
        return;
      }

      if (!storedState || storedState !== stateParam) {
        console.error("Invalid state. Stored:", storedState, "Received:", stateParam);
        manageAlerts(setError, "Invalid session state. Please click 'Let's Create' again.");
        setLoading(false);
        router.replace("/signin");
        return;
      }

      const code = search_params.get("code");
      if (!code) {
        manageAlerts(setError, "Missing authorization code");
        setLoading(false);
        router.replace("/signin");
        return;
      }

      const success = await requestTokens(code);
      if (success) {
        localStorage.removeItem("code_state");
        localStorage.removeItem("code_verifier");
        router.push("/");
      } else {
        setLoading(false);
        router.replace("/signin");
      }
    } catch (err) {
      console.error("Unexpected callback error:", err);
      manageAlerts(setError, "Sign-in error occurred, please try again");
      setLoading(false);
      router.replace("/signin");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      window.location.href = window.location.href.replace("//localhost", "//127.0.0.1");
      return;
    }

    const search_params = new URLSearchParams(window.location.search);
    if (search_params.has("code") && search_params.has("state")) {
      if (hasHandledCallback.current) return;
      hasHandledCallback.current = true;
      manageSpotifyCallback(search_params);
    }
  }, []);

  return (
    <>
      {loading ? <LoadingScreen /> : null}
      <main className="container mx-auto relative">
        {error ? (
          <div className="bg-error flex flex-row gap-2 rounded-2xl absolute p-6 top-0 inset-x-0 m-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        ) : null}
        <section className="flex flex-row min-h-screen justify-start items-center p-4">
          <div className="max-w-lg md:max-w-2xl">
            <h1 className="text-5xl md:text-9xl font-bold">Weatherify</h1>
            <p className="py-6">
              Create personalized playlists in your Spotify, that sync with your
              current time of day, weather, and recent taste. Explore the magic of
              music and weather coming together for a unique listening
              experience.
            </p>
            <button className="btn btn-primary" onClick={handleGetStarted}>
              Let&apos;s Create
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SignIn;
