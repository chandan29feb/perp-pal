import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import ConnectDB from "@/libs/DB";
import Board from "@/models/Board";

export const POST = async (request: NextRequest) => {
  try {
    await ConnectDB();

    const formData = await request.formData();
    const name = formData.get("name");
    const color = formData.get("color");
    const file = formData.get("image");

    if (!name || !file || !color) {
      return NextResponse.json(
        { message: "Board name, image, and color are required" },
        { status: 400 }
      );
    }

    // Validate that the file has necessary properties
    if (
      !file ||
      typeof file !== "object" ||
      !file.arrayBuffer ||
      !file.name ||
      !file.size
    ) {
      return NextResponse.json(
        { message: "Invalid file upload" },
        { status: 400 }
      );
    }

    const dirPath = path.join(process.cwd(), "public/uploads");
    await mkdir(dirPath, { recursive: true });

    const imageFileName = `board_image_${Date.now()}_${file.name}`;
    const filePath = path.join(dirPath, imageFileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${imageFileName}`;

    const newBoard = new Board({
      name,
      image: imageUrl,
      color,
    });

    await newBoard.save();

    return NextResponse.json(
      { message: "Board created successfully", board: newBoard },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating board:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};
