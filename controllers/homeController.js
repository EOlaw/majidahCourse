//module.exports.showCourses = (req, res) => {
    //res.render('courses');
//};
module.exports.showSignUp = (req, res) => {
    res.render('contact');
};
module.exports.postedSignUpForm = (req, res) => {
    res.render('thanks');
};

var courses = [
    {
        title: 'Event Driven Cakes',
        cost: 50
    },
    {
        title: 'Asynchronous Artichoke',
        cost: 25
    },
    {
        title: 'Object Oriented Orange Juice',
        cost: 10
    }
];
//Real one
//module.exports.showCourses = (req, res) => {
    //res.render('courses', {
        //offeredCourses: courses
    //});
//}

module.exports = {
    showCourses: (req, res) => {
        res.render('courses', {
            offeredCourses: courses
        })
    }
}

