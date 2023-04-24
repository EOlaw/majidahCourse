//Require the subscriber module.
const Subscriber = require('../models/subscriber');

//Retrieve all subscribers.
module.exports.getAllSubscribers = (req, res, next) => {
    Subscriber.find({})
        .exec()
        .then((subscribers) => {
            res.render('subscriber/subscribers', {
                subscribers: subscribers
            });
        })
        .catch((err) => {
            console.log(err.message);
            return [];
        })
        .then(() => {
            console.log('promise complete');
        })
};
//Render the contact page
module.exports.getSubscriptionPage = (req, res) => {
    res.render('subscriber/contact');
};
//Save subscribers
module.exports.saveSubscriber = (req, res) => {
    let newSubscriber = new Subscriber({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    });
    newSubscriber.save()
        .then(() => {
            res.render('subscriber/thanks')
        })
        .catch(err => {
            res.send(err)
        });
}