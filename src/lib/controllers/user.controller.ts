import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "../utils/asynchandler";
import { ApiError } from "../utils/error-handler";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/response-handler";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { MiddlewareContext } from "../../../types/middleware";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/coludinary-upload";

// create user
export const createUser = asyncHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { userName, email, password, role } = body;

  if ([userName, email, password, role].some((e) => e === ""))
    throw new ApiError(400, "All fields are required");

  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(402, "User already exist");

  const newUser = await User.create({
    userName,
    email,
    password,
    role,
  });

  if (!newUser) throw new ApiError(400, "Failed to create user");

  return NextResponse.json(new ApiResponse(200, {}, "User created"));
});

// generate tokens
export const generateAccessAndRefrehToken = async (
  userId: mongoose.Types.ObjectId
) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(401, "User not found");
    const accessToken = await user.getAccessToken();
    const refreshToken = await user.getRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Internal error on generating tokens");
  }
};

// cookie options
const expiresDate = new Date(
  Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
);
export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
  expires: expiresDate,
};

// log in
export const loginUser = asyncHandler(async (req: NextRequest) => {
  const { email, password } = await req.json();

  if ([email, password].some((e) => e === ""))
    throw new ApiError(400, "All fields are required");

  // check email
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(402, "User not exist");

  // check password
  const isPasswordOk = await user.checkPassword(password);
  if (!isPasswordOk) throw new ApiError(401, "Invalid password");

  const { accessToken, refreshToken } = await generateAccessAndRefrehToken(
    user?._id
  );

  (await cookies()).set("accessToken", accessToken, cookieOptions);
  (await cookies()).set("refreshToken", refreshToken, cookieOptions);

  return NextResponse.json(new ApiResponse(200, {}, "User logged in"));
});

// logout user
export const logoutUser = asyncHandler(async (req: NextRequest) => {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) throw new ApiError(400, "Invalid request");

  const verifiedToken = await jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );

  if (
    !verifiedToken ||
    typeof verifiedToken !== "object" ||
    !("_id" in verifiedToken)
  ) {
    throw new ApiError(401, "Unauthorised request");
  }

  const user = await User.findByIdAndUpdate(
    (verifiedToken as jwt.JwtPayload)._id,
    {
      refreshtoken: "",
    },
    { new: true }
  );

  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");

  return NextResponse.json(new ApiResponse(200, {}, "User logged out"));
});

// check for auth
export const checkAuth = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { userId } = context!;
    let isAuthenticated = false;
    if (userId) isAuthenticated = true;

    return NextResponse.json(
      new ApiResponse(200, { isAuthenticated }, "authentication checked")
    );
  }
);

// update user
export const updateUser = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { userId } = context!;
    const { email, userName } = await req.json();
    if (!email || !userName) throw new ApiError(402, "All fields are required");

    // check for new email
    const user = await User.findById(userId);
    if (email !== user.email) {
      const userByNewEmail = await User.findOne({ email });
      if (userByNewEmail) throw new ApiError(402, "Email is already in use");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        userName,
        email,
      },
      { new: true }
    ).select("-password -refreshToken");

    return NextResponse.json(
      new ApiResponse(200, updatedUser, "User details updated")
    );
  }
);

// update password
export const updatePassword = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { userId } = context!;
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword)
      throw new ApiError(400, "All fields are required");

    const user = await User.findById(userId);

    if (!user) throw new ApiError(400, "User not found");

    // check current password
    const isPasswordOk = await user.checkPassword(currentPassword);
    if (!isPasswordOk) throw new ApiError(402, "Invalid current password");

    user.password = newPassword;
    user.save({ validateBeforeSave: false });

    return NextResponse.json(new ApiResponse(200, "Password updated"));
  }
);

// update avatar
export const updateAvatar = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { userId, files } = context!;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(400, "User not found");

    const image = files?.avatar;
    if (!image) throw new ApiError(400, "Avatar file is required");

    const buffer = Buffer.from(await image.arrayBuffer());

    const uploadData = await uploadToCloudinary(buffer, image.name);
    if (!uploadData) throw new ApiError(402, "Failed to upload avatar");

    if (user.avatar) {
      await deleteFromCloudinary(user.avatar);
    }

    user.avatar = uploadData.url;
    user.save({ validateBeforeSave: false });

    return NextResponse.json(new ApiResponse(200, user, "Avatar updated"));
  }
);

export const updateRole = asyncHandler(async (req: NextRequest) => {
  const { userId, role } = await req.json();
  if (!userId || !role) throw new ApiError(400, "All fields are required");
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
  if (!user) throw new ApiError(402, "User not found");
  return NextResponse.json(new ApiResponse(200, {}, "User role updated"));
});

// queries
export const getUserById = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) throw new ApiError(400, "userid is required");

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) throw new ApiError(402, "User not found");

    return NextResponse.json(new ApiResponse(200, user, "User fetched"));
  }
);

// fetch current user
export const getCurrentUser = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { userId } = context!;
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) if (!user) throw new ApiError(402, "User not authorised");

    return NextResponse.json(new ApiResponse(200, user, "User fetched"));
  }
);

// get user list
export const getAllUsers = asyncHandler(
  async (req: NextRequest, context: MiddlewareContext | undefined) => {
    const { userId } = context!;
    const userObjId = new mongoose.Types.ObjectId(userId);

    const userList = await User.aggregate([
      {
        $match: {
          _id: { $ne: userObjId },
        },
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          email: 1,
          role: 1,
          createdAt: 1,
        },
      },
    ]);

    return NextResponse.json(new ApiResponse(200, userList, "Users fetched"));
  }
);
