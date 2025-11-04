import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { json } from "express";



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating referesh and access token")
    }
}



const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, phone, role } = req.body;

    if (!username || !email || !password || !phone) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    if (existingUser) {
        throw new ApiError(400, "Email or Phone Number already exists")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        phone,
        role
    })

    const createUser = await User.findById(user._id).select('-password')

    if (!createUser) {
        throw new ApiError(500, "Somthing went wrong while registering the user")
    }

    return res.status(201).json(new ApiResponse(200, createUser, "User registered successfully"))
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log('email:', email, 'password : ', password);

    if (!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User dose not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findOne(user._id).select('-password -refreshToken')

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie('accessToken', accessToken, option)
        .cookie('refreshToken', refreshToken, option)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in Successfully"))
})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res.status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, "User logged out"))

})



export { registerUser, loginUser, logoutUser };