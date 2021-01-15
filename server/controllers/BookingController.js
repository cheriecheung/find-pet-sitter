const AppointmentOneDay = require('../model/AppointmentOneDay');
const AppointmentOvernight = require('../model/AppointmentOvernight');
const Booking = require('../model/Booking');
const User = require('../model/User');
const { sendTwilioSMS } = require('../helpers/sms')
const { sendNewBookingMail, sendUpdatedBookingMail } = require('../helpers/mailer')
const {
  createAutomatedMessage,
  getNewBookingStatus,
  getBookingInfo,
  getUnreadBookings
} = require('../helpers/bookings')

module.exports = {
  getAppointmentTime: async (req, res) => {
    const { userId } = req.verifiedData
    if (!userId) return res.status(403).json('ERROR/USER_NOT_FOUND');

    // const userRecord = await User.findById(userId);
    // const {owner} = userRecord

    // if (owner) return res.status(404).json('no_owner_profile');

    // TRY CATCH
    await User.findById(userId)
      .populate('owner')
      .exec(async (err, user) => {
        if (err) return err;

        const ownerIdObj = user.owner;

        if (!ownerIdObj) return res.status(200).json('OWNER_PROFILE_NOT_FOUND');

        const oneDayRecords = await AppointmentOneDay.find({
          owner: ownerIdObj,
        });
        const overnightRecords = await AppointmentOvernight.find({
          owner: ownerIdObj,
        });

        if ((oneDayRecords.length === 0) & (overnightRecords.length === 0)) {
          return res.status(200).json('APPOINTMENT_TIME_NOT_FOUND');
        }

        const allOneDays = oneDayRecords.map(({ id, date, startTime, endTime }) => ({
          id,
          date,
          startTime,
          endTime,
        }));
        const allOvernight = overnightRecords.map(({ id, startDate, endDate }) => ({
          id,
          startDate,
          endDate,
        }));

        return res.status(200).json({ allOneDays, allOvernight });
      });
  },

  sendRequest: async (req, res) => {
    const { userId: ownerUserId } = req.verifiedData
    if (!ownerUserId) return res.status(404).json('ERROR/USER_NOT_FOUND');

    const { sitterId: sitterShortId, type } = req.body;

    try {
      const [owner, sitter] = await Promise.all([
        User.findById(ownerUserId),
        User.findOne({ urlId: sitterShortId }),
      ]);

      const {
        owner: ownerObjId,
        postcode,
        firstName,
        lastName
      } = owner;

      const {
        id: sitterUserId,
        sitter: sitterObjId,
        email,
        getEmailNotification,
        phone,
        getSmsNotification,
      } = sitter;

      if (!ownerObjId || !sitterObjId)
        return res.status(404).json('ERROR/ERROR_OCCURED');

      let newBooking;
      // const bookingObj = {
      //   owner: `${firstName} ${lastName.charAt(0)}`,
      //   type,
      //   location: postcode,
      // }

      if (type === 'oneDay') {
        const { date, startTime, endTime, price } = req.body;

        newBooking = new Booking({
          owner: ownerObjId,
          sitter: sitterObjId,
          appointmentType: type,
          date,
          startTime,
          endTime,
          location: postcode,
          price,
          status: 'requested',
        });

        // bookingObj.date = date;
        // bookingObj.startTime = startTime;
        // bookingObj.endTime = endTime;
        // bookingObj.price = price;
      }

      if (type === 'overnight') {
        const { startDate, endDate, price } = req.body;

        newBooking = new Booking({
          owner: ownerObjId,
          sitter: sitterObjId,
          appointmentType: type,
          startDate,
          endDate,
          location: postcode,
          price,
          status: 'requested',
        });

        // bookingObj.startDate = startDate;
        // bookingObj.endDate = endDate;
        // bookingObj.price = price;
      }

      await newBooking.save(async (error, saved) => {
        if (error) return res.status(400).json('ERROR/ERROR_OCCURED');

        console

        const { err } = await createAutomatedMessage({
          bookingId: saved.id,
          bookingAction: 'request',
          senderId: ownerUserId,
          recipientId: sitterUserId,
        })
        if (err) return res.status(400).json('ERROR/ERROR_OCCURED');
      });

      const ownerName = `${firstName} ${lastName.charAt(0)}`

      if (email && getEmailNotification) {
        sendNewBookingMail({ email, name: ownerName })
      }

      if (phone && getSmsNotification) {
        sendTwilioSMS(phone, 'BOOKING_REQUESTED', { name: ownerName })
      }

      // +1 booking notification to sitter's notification document

      return res.status(201).json('Booking request successfully created');
    } catch (e) {
      console.log({ e });
      return res.status(400).json('ERROR/ERROR_OCCURED');
    }
  },

  getRecords: async (req, res) => {
    const { userId } = req.verifiedData
    if (!userId) return res.status(403).json('ERROR/USER_NOT_FOUND');

    //   // if requested / comfirmed booking is expired, change status to 'declined'

    const { type, status } = req.query;

    try {
      const userRecord = await User.findById(userId).select(['owner', 'sitter']);
      if (!userRecord) return res.status(403).json('ERROR/USER_NOT_FOUND');

      const { owner, sitter } = userRecord;

      const defaultRecords = { requested: [], confirmed: [], completed: [], declined: [] }
      let filter;
      let isReadField;
      let path;

      if (type === 'sitting_jobs') {
        if (!sitter) return res.status(200).json(defaultRecords);
        filter = { sitter, status };
        isReadField = 'isReadBySitter';
        path = 'owner';
      }

      if (type === 'sitting_service') {
        if (!owner) return res.status(200).json(defaultRecords);
        filter = { owner, status };
        isReadField = 'isReadByOwner';
        path = 'sitter';
      }

      //https://stackoverflow.com/questions/42017424/mongodb-return-updated-object-with-populate

      await Booking.updateMany(
        filter,
        { $set: { [isReadField]: true } }
      )

      let bookingRecords = await Booking
        .find({ filter })
        .populate({
          path,
          select: ['user'],
          populate: {
            path: 'user',
            select: ['firstName', 'lastName', 'profilePicture', 'urlId'],
          }
        })

      console.log({ bookingRecords })

      if (bookingRecords.length > 0) {
        bookingRecords = bookingRecords.reduce((output, record) => {
          const { status } = record;

          if (status === 'requested') {
            output.requested.push(record)
          }
          if (status === 'confirmed') {
            output.confirmed.push(record)
          }
          if (status === 'completed') {
            output.completed.push(record)
          }
          if (status === 'declined') {
            output.declined.push(record)
          }

          return output
        }, defaultRecords);
      }

      const { notifications } = await getUnreadBookings(owner, sitter)

      return res.status(200).json({ bookingRecords, notifications });
    } catch (err) {
      console.log({ err })
      return res.status(401).json('ERROR/ERROR_OCCURED');
    }
  },

  // getRecords: async (req, res) => {
  //   const { userId } = req.verifiedData
  //   if (!userId) return res.status(403).json('ERROR/USER_NOT_FOUND');

  //   // if requested / comfirmed booking is expired, change status to 'declined'
  //   const { type } = req.query;

  //   try {
  //     const userRecord = await User.findById(userId);
  //     if (!userRecord) return res.status(403).json('ERROR/USER_NOT_FOUND');

  //     const { sitter: sitterObjId, owner: ownerObjId } = userRecord

  //     let filter;

  //     const defaultRecords = { requested: [], confirmed: [], completed: [], declined: [] }

  //     if (type === 'jobs') {
  //       if (!sitterObjId) return res.status(200).json(defaultRecords);
  //       filter = { sitter: sitterObjId }
  //     } else {
  //       if (!ownerObjId) return res.status(200).json(defaultRecords);
  //       filter = { owner: ownerObjId }
  //     }

  //     const path = type === 'jobs' ? 'owner' : 'sitter';

  //     let bookingRecords = await Booking
  //       .find(filter)
  //       .populate({
  //         path,
  //         select: ['user'],
  //         populate: {
  //           path: 'user',
  //           select: ['firstName', 'lastName', 'profilePicture', 'urlId'],
  //         }
  //       })

  //     if (bookingRecords.length > 0) {
  //       bookingRecords = bookingRecords.reduce((output, record) => {
  //         const { status } = record;

  //         if (status === 'requested') {
  //           output.requested.push(record)
  //         }
  //         if (status === 'confirmed') {
  //           output.confirmed.push(record)
  //         }
  //         if (status === 'completed') {
  //           output.completed.push(record)
  //         }
  //         if (status === 'declined') {
  //           output.declined.push(record)
  //         }

  //         return output
  //       }, { requested: [], confirmed: [], completed: [], declined: [] });
  //     }

  //     return res.status(200).json(bookingRecords);
  //   } catch (err) {
  //     console.log({ err })
  //     return res.status(401).json('ERROR/ERROR_OCCURED');
  //   }
  // },

  // markBookingsAsRead: async (req, res) => {
  //   const { userId } = req.verifiedData
  //   if (!userId) return res.status(403).json('ERROR/USER_NOT_FOUND');

  //   const { type, status } = req.query;

  //   try {
  //     console.log({ type, status })

  //     return res.status(200).json('')
  //   } catch (err) {
  //     console.log({ err })
  //     return res.status(401).json('ERROR/ERROR_OCCURED');
  //   }
  // },

  fulfillAction: async (req, res) => {
    const { id, action } = req.body

    try {
      const { status, description } = getNewBookingStatus(action)

      const bookingRecord = await Booking.findOneAndUpdate(
        { _id: id },
        { $set: { status } },
        { useFindAndModify: false }
      );
      if (!bookingRecord) return res.status(401).json('ERROR/ERROR_OCCURED')

      // const [{ phone, email }, { firstName, lastName }] = await Promise.all([
      const [owner, sitter] = await Promise.all([
        User.findOne({ owner: bookingRecord.owner }),
        User.findOne({ sitter: bookingRecord.sitter })
      ]);

      const {
        id: ownerUserId,
        email,
        getEmailNotification,
        phone,
        getSmsNotification
      } = owner;

      const {
        id: sitterUserId,
        firstName,
        lastName
      } = sitter

      if (!firstName || !lastName) {
        return res.status(401).json('ERROR/USER_NOT_FOUND')
      }

      const { err } = await createAutomatedMessage({
        bookingId: id,
        bookingAction: action,
        senderId: sitterUserId,
        recipientId: ownerUserId,
      })
      if (err) return res.status(400).json('ERROR/ERROR_OCCURED');

      const sitterName = `${firstName} ${lastName.charAt(0)}`

      if (email && getEmailNotification) {
        sendUpdatedBookingMail({ email, action, name: sitterName })
      }

      if (phone && getSmsNotification) {
        sendTwilioSMS(phone, description, { name: sitterName })
      }

      // change notification on web

      return res.status(200).json('success')
    } catch (err) {
      console.log({ err })
      return res.status(400).json('ERROR/ERROR_OCCURED')
    }
  },

  getBooking: async (req, res) => {
    const { userId } = req.verifiedData
    if (!userId) return res.status(403).json('ERROR/USER_NOT_FOUND');

    const { id: bookingId } = req.params;

    try {
      const { bookingInfo } = await getBookingInfo(userId, bookingId);
      if (!bookingInfo) return res.status(401).json('ERROR/ERROR_OCCURED')

      return res.status(200).json(bookingInfo)
    } catch (err) {
      console.log({ err })
      return res.status(401).json('ERROR/ERROR_OCCURED')
    }
  }
};
