import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    console.log(id);
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ id });
    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    } else {
      return NextResponse.json({ massage: "User not found" }, {status: 404});
    }
  } catch (e) {
    return NextResponse.json({ massage: "error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log(data);
    const { db } = await connectToDatabase();
    console.log("data.id:", data.id);
    const isUserExist = await db.collection("users").countDocuments({ id: data.id }, { limit: 1 }) > 0;
    console.log("isUserExist:", isUserExist);
    let res;
    if (isUserExist) {
      // Update user, for updated refresh token, profile picture, and name
      res = await db.collection("users").updateOne({ id: data.id }, { $set: {
        name: data.name,
        image64: data.image64,
        image300: data.image300,
        refresh_token: data.refresh_token
      }});
    } else {
      res = await db.collection("users").insertOne({
        id: data.id,
        name: data.name,
        image64: data.image64,
        image300: data.image300,
        spotify: data.spotify,
        api: data.api,
        refresh_token: data.refresh_token
        // 31myo3hyiuz56jhrc464feitabdy
      });
    }
    return NextResponse.json({ res }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ massage: "error" });
  }
}

export async function PUT(request) {
  try {
    const { data } = await request.json();
    console.log(user);
    const { db } = await connectToDatabase();
    const res = await db.collection("users").updateOne({ id: data.id }, { $set: {
      name: data.name,
      image64: data.image64,
      image300: data.image300,
      refresh_token: data.refresh_token
    }});
    return NextResponse.json({ res }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ massage: "error" });
  }
}
