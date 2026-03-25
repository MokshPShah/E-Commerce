import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required." }, { status: 400 });
        }

        await connectDB();
        
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return NextResponse.json({ message: "Email already exists." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "user"
        });

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background-color: #f8f9fa; border-radius: 16px; border: 1px solid #f1f5f9;">
                    <h1 style="color: #020617; font-size: 28px; font-weight: 900; text-transform: uppercase; font-style: italic; margin-bottom: 24px;">STRENOXA<span style="color: #ec1313;">.</span></h1>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px; font-weight: 500;">
                        Hey ${name}, welcome to the elite community! We are thrilled to have you on board.
                    </p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Get ready to push your limits, track your gains, and fuel your performance with our science-backed nutrition.
                    </p>
                    <a href="${process.env.NEXTAUTH_URL}/shop" style="display: inline-block; background-color: #ec1313; color: #ffffff; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; text-decoration: none; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;">
                        Shop The Arsenal
                    </a>
                </div>
            `;

            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Welcome to Strenoxa! 🚀",
                html: html,
            });

        } catch (emailError) {
            console.error("Welcome email failed to send:", emailError);
        }

        return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred during registration." }, { status: 500 });
    }
}