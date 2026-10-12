import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UserProfile } from "@/types/spotify";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    console.log(id);

    if (!id) {
      return NextResponse.json({ message: "Missing user id" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection<UserProfile>("users").findOne({ id });
    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: UserProfile = await request.json();
    console.log(data);
    const { db } = await connectToDatabase();
    console.log("data.id:", data.id);

    const isUserExist =
      (await db
        .collection<UserProfile>("users")
        .countDocuments({ id: data.id }, { limit: 1 })) > 0;
    console.log("isUserExist:", isUserExist);

    let res;
    if (isUserExist) {
      // Update user, for updated refresh token, profile picture, and name
      res = await db.collection<UserProfile>("users").updateOne(
        { id: data.id },
        {
          $set: {
            name: data.name,
            image64: data.image64,
            image300: data.image300,
            refresh_token: data.refresh_token,
          },
        }
      );
    } else {
      res = await db.collection<UserProfile>("users").insertOne({
        id: data.id,
        name: data.name,
        image64: data.image64,
        image300: data.image300,
        spotify: data.spotify,
        api: data.api,
        refresh_token: data.refresh_token,
      });
    }
    return NextResponse.json({ res }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { data } = await request.json();
    const { db } = await connectToDatabase();
    const res = await db.collection<UserProfile>("users").updateOne(
      { id: data.id },
      {
        $set: {
          name: data.name,
          image64: data.image64,
          image300: data.image300,
          refresh_token: data.refresh_token,
        },
      }
    );
    return NextResponse.json({ res }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "error" },
      { status: 500 }
    );
  }
}
