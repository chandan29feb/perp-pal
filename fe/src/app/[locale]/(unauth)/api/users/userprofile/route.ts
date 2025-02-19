import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import connectDB from "@/libs/DB";
import User from "@/models/user";

export const POST = async (request: NextRequest) => {
  try {
    connectDB();

    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No valid file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const dirPath = path.join(process.cwd(), "public/assets/profileImage");
    const filePath = path.join(dirPath, `profileImage_${userId}.png`);

    await mkdir(dirPath, { recursive: true });

    await writeFile(filePath, buffer);

    await User.findByIdAndUpdate({ _id: userId }, {
      profileImage: `public/assets/profileImage/profileImage_${userId}.png`
    })
    return NextResponse.json({ message: "Image saved successfully.", status: 201 });
  } catch (error) {
    console.error("Error occurred: ", error);
    return NextResponse.json({ message: "Failed to save the image.", status: 500 });
  }
};
