import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
}

export async function GET() {
  const cookieStore = await cookies();
  const refresh_token = cookieStore.get("refresh_token")?.value;
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
    const response = await axios.post<SpotifyTokenResponse>(
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
  } catch (error: any) {
    console.error(error);
    if (error?.response?.status === 400) {
      return NextResponse.json(
        {
          error: "Needs user to sign in again",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

const setTokensInCookies = (
  data: SpotifyTokenResponse,
  cookieStore: Awaited<ReturnType<typeof cookies>>
) => {
  const { access_token, refresh_token, expires_in } = data;
  const access_token_expires_at = new Date(
    Date.now() + (expires_in - 360) * 1000
  );
  const refresh_token_expires_at = new Date();
  refresh_token_expires_at.setMonth(refresh_token_expires_at.getMonth() + 6);

  cookieStore.set({
    name: "access_token",
    value: access_token,
    expires: access_token_expires_at,
    sameSite: "strict",
    secure: Boolean(process.env.NEXT_PUBLIC_SECURE_COOKIE),
  });

  if (refresh_token) {
    cookieStore.set({
      name: "refresh_token",
      value: refresh_token,
      expires: refresh_token_expires_at,
      sameSite: "strict",
      secure: Boolean(process.env.NEXT_PUBLIC_SECURE_COOKIE),
    });
  }
};
