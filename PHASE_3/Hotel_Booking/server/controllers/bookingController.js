import transporter from "../config/nodemailer.js";
import Booking from "../models/BookingModel.js";
import Hotel from "../models/hotelModel.js";
import Room from "../models/roomModel.js";

// Function to check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
};

//Api to check Availability of a room
//Post /api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    };
};

//API to create New Booking
//Post /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        //Before Booking  check Availability
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room,
        });

        if (!isAvailable) {
            return res.json({ success: false, message: "Room Is Not Available.." });
        }

        //get totalprice  from room
        const roomData = await Room.findById(room).populate('hotel');
        let totalPrice = roomData.pricePerNight;

        //calculate totalprice based on night
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        //checkIn.getTime() → Sat, Jul 5 2025 00:00:00 → 1751673600000 ms
        //checkOut.getTime() → Tue, Jul 8 2025 00:00:00 → 1751932800000 ms
        //timeDiff = 1751932800000 - 1751673600000 = 259200000 ms
        //nights = Math.ceil(259200000 / 86400000) = Math.ceil(3) = 3 nights
        //1000 * 3600 * 24 = 86,400,000 milliseconds in 1 day

        totalPrice *= nights;

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:req.user.email,
            subject:'Hotel Booking Details',
            html:`
                <h2>Your Booking Details</h2>
                <p>Dear ${req.user.username},</p>
                <p>Thank you for your Booking! Here are your Details :</p>
                <ul>
                    <li><strong>Booking ID :</strong> ${booking._id}</li>
                    <li><strong>Hotel Name :</strong> ${roomData.hotel.name}</li>
                    <li><strong>Location :</strong> ${roomData.hotel.address}</li>
                    <li><strong>Date :</strong> ${booking.checkInDate.toDateString()}</li>
                    <li><strong>Booking Amount :</strong>${process.env.CURRENCY} || '$' ${booking.totalPrice} /night</li>
                </ul>
                <p>We Look forward to welcoming you!</p>
                <p>If you need to make any changes, feel free to contact us.</p>
            `,
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Booking created Successfully.." })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to Create Booking.." });
    }
};

//Api to get all bookings for a user
//Get /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Failed to Fetch Booking.." });
    }
};

//get Booking details for perticular owner
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel Found..." });
        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate('room hotel user').sort({ createdAt: -1 });
        //Total Bookings
        const totalBookings = bookings.length;
        //Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })
    } catch (error) {
        res.json({ success: false, message: "Failed to Fetch Booking.." });
    }
};