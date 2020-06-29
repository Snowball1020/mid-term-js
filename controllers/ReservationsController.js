// You need to complete this controller with the required 7 actions

const view = "reservations";
const Reservation = require("../models/reservation")
const User = require("../models/user")

//Index page this is where the logged in user can see their reservations (only their reservation)
exports.index = async (req, res) => {

    try {

        const reservations = await Reservation
            //find one user (logged in user)
            .find({ user: req.user._id })
            //then populate data based on the id, make sure user with NOY capitalzied bec this refers attribute inside database. not a Model
            .populate("user")
        //and pass all collected data into index page so we can use them there
        res.render(`${view}/index`, {
            pageTitle: "Index Page",
            reservations: reservations,
            user: req.user
        })

    } catch (error) {
        req.flash('danger', `${error}, error happened reading index page, back to home page`);
        res.redirect("/")
    }
}

//New page simply take the logged in user to the page they can make a reservation(form)
exports.new = async (req, res) => {
    res.render(`${view}/new`, {
        pageTitle: "New Reservation",
        restaurants: ["Kelseys", "Montanas", "Outbacks", "Harveys", "Swiss Chalet"]

    })
}

//Create new reservation
exports.create = async (req, res) => {

    try {
        //before creating new reservation, specify the user making this reservation by matching email
        const user = await User.findOne({ email: req.user.email })
        //once ditected the user then put their Object id into "user" field in the Reservation Model
        //and then fill in the rest with whatever typed in the form 
        const reservation = await Reservation.create({ user: user._id, ...req.body })
        req.flash('success', `Your seats are reserved, Thank you for choosing us!`);
        res.redirect("/reservations")

    } catch (error) {
        req.flash('danger', `${error}`);
        res.redirect("/reservations/new")
    }

}

//Show page this is where the user see the single page for a single reservation
exports.show = async (req, res) => {

    try {

        //find a single reservation by its id
        const reservation = await Reservation
            .findOne({ _id: req.params.id })
            //make sure user with NOT capitalzied bec this refers "user" attribute inside database(collection). not a Model
            .populate("user")
        // and pass it to /show page as reservation so we can use it there
        res.render(`${view}/show`, {
            pageTitle: "Show Page",
            reservation: reservation,
            user: req.user
        })
    } catch (error) {
        res.send(console.log(error))
    }

}

//Edit page
exports.edit = async (req, res) => {

    try {
        //first pick up the data clicked by req.params.id
        const reservation = await Reservation.findOne({ _id: req.params.id });
        // take all data inside reservation and store into formData, and pass it to /edit page
        res.render(`${view}/edit`, {
            pageTitle: "edit reservation",
            formData: reservation,
            restaurants: ["Kelseys", "Montanas", "Outbacks", "Harveys", "Swiss Chalet"]
        });
    } catch (error) {
        req.flash('danger', `${error}`);
        res.redirect('/login');
    }
};

//Update page
exports.update = async (req, res) => {

    try {
        //get the user id from session

        const user = await User.findOne({ email: req.user.email })

        //        console.log(req.user)
        //attach the user id with input data and store everything as one data "contents"
        const contents = { user: user._id, ...req.body }
        //now pass to findByIdAndUpdate (a selected reservation (req.body.id is reservation id), contents)
        //make sure here we store the selected reservation id and loggedin user id as well as the input data
        //user id was taken from req.session.passport , and reservartion id was sent from edit.ejs
        const reservation = await Reservation.findByIdAndUpdate(req.body.id, contents)

        req.flash('success', 'The reservation was updated successfully');
        res.redirect(`/reservations/${req.body.id}`);

    } catch (error) {
        req.flash('danger', `${error}`);
        res.redirect(`/reservations/${req.body.id}/edit`);
    }
}


//Delete page
exports.delete = async (req, res) => {

    try {
        //when delete button clicked take its id and delete it
        //the req.body.id (reservation id) is sent from form (index.ejs) and try to match the _Id inside database, if hit, delete the one
        await Reservation.remove({ _id: req.body.id })
        req.flash('danger', `The reservation deleted`);
        res.redirect("/reservations")

    } catch (error) {

        req.flash('danger', `failed to delete`);
        res.redirect("/reservations")
        console.log(error)
    }

}