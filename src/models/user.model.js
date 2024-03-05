// user.model.js
import mongoose from 'mongoose';

const enumPriority = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2
};

const userSchema = new mongoose.Schema({
    phone_number: {
        type: String, // Changed to String to allow non-numeric characters
        required: [true, 'phone_number is required'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^\+\d{10,15}$/.test(v); // Allows a plus sign followed by 10 to 15 digits
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    priority: {
        type: Number,
        required: [true, 'priority is required'],
        enum: enumPriority,
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    },
    password : {
        type: String,
        required: [true, 'Password is required']
    },
    // Relationships
    tasks :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
});

const User = mongoose.model('User', userSchema);

export default User;
