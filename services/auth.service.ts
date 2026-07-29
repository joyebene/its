import { NextResponse } from "next/server";

import User, { UserStatus } from "@/models/User";

import { InvitationRegisterInput, LoginInput, RegisterInput } from "@/schema/auth.schema";

import { comparePassword, hashPassword } from "@/lib/bcrypt";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "@/lib/jwt";

import Invitation from "@/models/Invitation";
import { NotificationService } from "./notification.service";
import { NotificationType } from "@/models/Notification";


export class AuthService {

    private static async generateAuthResponse(
        user: any,
        status = 200
    ) {

        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const accessToken =
            generateAccessToken(payload);

        const refreshToken =
            generateRefreshToken(payload);

        user.refreshToken =
            refreshToken;

        await user.save();

        const response =
            NextResponse.json(
                {
                    success: true,
                    message:
                        "Authentication successful.",
                    data: {
                        accessToken,
                        user,
                    },
                },
                { status }
            );

        response.cookies.set({
            name: "refreshToken",
            value: refreshToken,
            httpOnly: true,
            secure:
                process.env.NODE_ENV ===
                "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    }

    //register
    static async register(data: RegisterInput) {
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
        } = data;

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already exists.",
                },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            role: data.role,
        });

        await NotificationService.create(

            user._id.toString(),

            "Welcome to Import Tracking System",

            `Hello ${user.firstName}, your account has been created successfully.`,

            NotificationType.SUCCESS

        );

        // Notify admins
        await NotificationService.notifyAdmins(

            "New User Registered",

            `${user.firstName} ${user.lastName} has created a new account.`,

            NotificationType.INFO

        );


        return this.generateAuthResponse(user, 201);
    }

    //login
    static async login(data: LoginInput) {
        const { email, password } = data;

        const user = await User.findOne({
            email: email.toLowerCase(),
            isDeleted: false,
        }).select("+password +refreshToken");

        if (!user) {
            throw new Error("Invalid email or password");
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new Error("Your account is inactive");
        }

        const isPasswordValid = await comparePassword(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        user.lastLogin = new Date();

        await user.save();

        return {
            accessToken,
            refreshToken,
            user,
        };
    }

    //refresh token
    static async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new Error("Refresh token missing");
        }

        const decoded = verifyRefreshToken(refreshToken) as {
            id: string;
            email: string;
            role: string;
        };

        const user = await User.findById(decoded.id)
            .select("+refreshToken");

        if (!user) {
            throw new Error("User not found");
        }

        if (user.refreshToken !== refreshToken) {
            throw new Error("Invalid refresh token");
        }

        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        user.refreshToken = newRefreshToken;

        await user.save();

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    static async logout(userId: string) {
        await User.findByIdAndUpdate(userId, {
            refreshToken: null,
        });
    }

}