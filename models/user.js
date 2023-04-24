const mongoose = require('mongoose');
const {Schema} = mongoose;
const Subscriber = require('./subscriber') //Required for checking for subscribers
const userSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            trim: true
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    zipCode: {
        type: Number,
        min: [10000, 'Zip code too short'],
        max: 99999
    },
    password: { //Add a password property
        type: String,
        required: true
    },
    courses: [{type: Schema.Types.ObjectId, ref: 'Course'}], //Add a courses property to connect users to courses
    subscribedAccount: {type: Schema.Types.ObjectId, ref: 'Subscribers'} //Add a subscribedAccount to connect users to subscribers.
}, {
    timestamps: true //Add a timestamps property to record createdAt and updatedAt dates.
})

//Add a virtual attribute to get the user's full name.
userSchema.virtual('fullName')
    .get(function() {
        return `${this.name.first} ${this.name.last}`;
    });
//Ideally, whenever a new user is created, you'd like to check for an existing subscriber with the same email address and associate the two.
//You do so with a Mongoose pre("save") hook.
userSchema.pre('save', function(next) {
    let user = this; //Use the function keyword in the callback.
    if (user.subscribedAccount === undefined) { //Add a quick conditional check for existing subscriber connections.
        Subscriber.findOne({ //Query foor a single subscriber.
            email: user.email
        })
            .then(subscriber => { 
                user.subscribedAccount = subscriber; //Connect the user with a subscriber account.
                next();
            })
            .catch(error => {
                console.log(`Error in connecting subscriber: ${error.message}`);
                next(error); //Pass any errors to the next middleware function.
            });
    } else {
        next(); //Call next function if user already has an association
    }
})
module.exports = mongoose.model('User', userSchema);