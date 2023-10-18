import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET() {
  const cookieStore = cookies();
  const refresh_token = cookieStore.get("refresh_token").value;
  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }

  if (!refresh_token) {
    return NextResponse.json(
      {
        error: "Needs user to sign in again",
      },
      { status: 400 }
    );
  }

  try {
    const data = `grant_type=refresh_token&refresh_token=${refresh_token}`;
    // Make the POST request to Spotify API
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      data,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 200) {
      setTokensInCookies(response.data, cookieStore);
      return NextResponse.json(
        {
          access_token: response.data.access_token,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          data: response.data,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error(error);
    if (error.response) {
      if (error.response.status === 400) {
        return NextResponse.json(
          {
            error: "Needs user to sign in again",
          },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

const setTokensInCookies = (data, cookieStore) => {
  const { access_token, refresh_token, expires_in } = data;
  // Setting expirty time of access token before 6 minutes of original expiry time
  const access_token_expires_at = new Date(
    Date.now() + (expires_in - 360) * 1000
  );
  // Setting expirty time of refresh token of 6 months
  const refresh_token_expires_at = new Date();
  refresh_token_expires_at.setMonth(refresh_token_expires_at.getMonth() + 6);

  cookieStore.set({
    name: "access_token",
    value: access_token,
    expires: access_token_expires_at,
    sameSite: "strict",
    secure: process.env.NEXT_PUBLIC_SECURE_COOKIE,
  });
  cookieStore.set({
    name: "refresh_token",
    value: refresh_token,
    expires: refresh_token_expires_at,
    sameSite: "strict",
    secure: process.env.NEXT_PUBLIC_SECURE_COOKIE,
  });
};
