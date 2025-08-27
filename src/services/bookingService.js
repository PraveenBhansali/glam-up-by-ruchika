import { supabase } from '../supabase.js'

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          service: bookingData.service,
          date: bookingData.date,
          time: bookingData.time,
          notes: bookingData.notes,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error creating booking:', error)
    return { success: false, error: error.message }
  }
}

// Get all bookings
export const getBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return { success: false, error: error.message }
  }
}

// Get bookings for a specific date
export const getBookingsByDate = async (date) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date)
      .order('time', { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching bookings by date:', error)
    return { success: false, error: error.message }
  }
}

// Delete a booking
export const deleteBooking = async (id) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting booking:', error)
    return { success: false, error: error.message }
  }
}
