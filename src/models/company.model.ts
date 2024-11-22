import mongoose, { Document, Schema } from "mongoose";
import validator from 'validator';

enum IndustryType {
    TECHNOLOGY = 'Technology',
    FINANCE = 'Finance',
    HEALTHCARE = 'Healthcare',
    EDUCATION = 'Education',
    OTHER = 'Other',
}

interface ICompany extends Document {
    name: string;
    idustry: IndustryType;
    description: string;
    logo: string;
    establishedDate: Date
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        zip: string;
    },
    contact: {
        phone: string;
        email: string;
        website: string;
    },
    user: mongoose.Types.ObjectId;
}

const companySchema = new Schema<ICompany>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    idustry: {
        type: String,
        enum: Object.values(IndustryType),
        required: true,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
        required: true,
    },
    establishedDate: {
        type: Date,
        required: true,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
    },
    contact: {
        phone: {
            type: String,
            required: true,
            validate: {
                validator: (value: string) => validator.isMobilePhone(value, 'any', { strictMode: true }),
                message: 'Invalid phone number'
            }
        },
        email: {
            type: String,
            required: true,
            validate: {
                validator: (value: string) => validator.isEmail(value),
                message: 'Invalid email'
            }
        },
        website: {
            type: String,
            required: true,
            validate: {
                validator: (value: string) => validator.isURL(value),
                message: 'Invalid website'
            }
        }
    },
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

export default Company