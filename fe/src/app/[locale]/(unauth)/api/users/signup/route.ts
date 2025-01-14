import connectDB from "@/libs/DB";

import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "@/models/user";
import { cookiesSet } from "@/libs/cookiesSet";


export async function POST(request: NextRequest) {

    try {
        connectDB();

        const reqBody = await request.json()
        const { username, email, password } = reqBody

        const user = await User.findOne({ email: email });

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        const response = cookiesSet(savedUser, username, email);
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }
}