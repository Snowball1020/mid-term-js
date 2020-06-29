// You need to define the schema for a reservation
// The fields you require are:
// associated user
// quantity of guests
// restaurant name
// date and time of reservation (you can do these as separate fields if you wish) 

const mongoose = require("mongoose")

const ReservationSchema = new mongoose.Schema({

    //refered User Model and its objectId as one of documents in Reservation document
    user: {
        type: mongoose.Schema.Types.ObjectId,
        //here User with capitalized because it is the way declared in User Model export
        ref: "User",
        required: true
    },

    restaurant: {
        type: String,
        required: true
    },
    quantityOfGuests: {
        type: Number,
        required: true
    },
    dateAndTime: {
        type: Date,
        required: true,
        set: val => {
            return new Date(val);
        },
        get: val => {
            const date = val.toISOString();
            return date.substring(0, date.length - 1);
        }
    }

}, {
        timestamps: true
    })

module.exports = mongoose.model("Reservation", ReservationSchema)