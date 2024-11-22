import mongoose, { Document, Schema } from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface ISuperAdmin extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp: string | null;
    refreshToken: string | null;
    isVerified: boolean;
}

const superAdminSchema = new Schema<ISuperAdmin>({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Invalid email'
        }
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

superAdminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
})

superAdminSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

superAdminSchema.methods.compareOTP = async function (enteredOTP: string): Promise<boolean> {
    return await bcrypt.compare(enteredOTP, this.otp);
}

superAdminSchema.methods.getAccessToken = function () {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    return jwt.sign(
        { _id: this._id, firstName: this.firstName, lastName: this.lastName, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

superAdminSchema.methods.getRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

const SuperAdmin = mongoose.models.SuperAdmin || mongoose.model<ISuperAdmin>('SuperAdmin', superAdminSchema);

export default SuperAdmin