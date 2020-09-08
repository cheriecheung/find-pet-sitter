export function bookings(state = {}, action) {
  switch (action.type) {
    case 'GET_SITTING_JOB_BOOKINGS':
      return { data: action.payload };
    case 'GET_SITTING_JOB_BOOKINGS':
      return { data: action.payload };
    case 'DECLINE_BOOKING':
      return 'Booking declined';
    case 'SCHEDULE_MEETUP':
      return 'You chose to schedule a meet-up';
    case 'ACCEPT_BOOKING':
      return 'Booking accepted';
    case 'CANCEL_BOOKING':
      return 'Booking cancelled';
    case 'COMPLETED_BOOKING':
      return 'Booking Completed';
    case 'SUBMIT_REVIEW':
      return 'You submitted your review';
    default:
      return state;
  }
}
