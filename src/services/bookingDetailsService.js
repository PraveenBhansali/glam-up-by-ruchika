import { supabase } from '../supabase.js'

// Create booking details
export const createBookingDetails = async (bookingId, detailsData) => {
  try {
    const { data, error } = await supabase
      .from('booking_details')
      .insert([
        {
          booking_id: bookingId,
          payment_status: detailsData.payment_status || 'pending',
          payment_amount: detailsData.payment_amount || 0,
          payment_method: detailsData.payment_method || '',
          payment_notes: detailsData.payment_notes || '',
          actual_people: detailsData.actual_people || null,
          actual_duration: detailsData.actual_duration || null,
          services_provided: detailsData.services_provided || [],
          additional_services: detailsData.additional_services || '',
          completion_notes: detailsData.completion_notes || '',
          client_feedback: detailsData.client_feedback || '',
          client_rating: detailsData.client_rating || null,
          photos_uploaded: detailsData.photos_uploaded || false,
          photo_urls: detailsData.photo_urls || [],
          before_after_photos: detailsData.before_after_photos || false,
          workers_involved: detailsData.workers_involved || [],
          worker_payments: detailsData.worker_payments || {},
          profit_margin: detailsData.profit_margin || null,
          travel_distance: detailsData.travel_distance || null,
          travel_cost: detailsData.travel_cost || null,
          product_cost: detailsData.product_cost || null,
          follow_up_required: detailsData.follow_up_required || false,
          follow_up_date: detailsData.follow_up_date || null,
          follow_up_notes: detailsData.follow_up_notes || ''
        }
      ])
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error creating booking details:', error)
    return { success: false, error: error.message }
  }
}

// Get booking details by booking ID
export const getBookingDetails = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from('booking_details')
      .select('*')
      .eq('booking_id', bookingId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching booking details:', error)
    return { success: false, error: error.message }
  }
}

// Update booking details
export const updateBookingDetails = async (bookingId, detailsData) => {
  try {
    const { data, error } = await supabase
      .from('booking_details')
      .upsert([
        {
          booking_id: bookingId,
          payment_status: detailsData.payment_status,
          payment_amount: detailsData.payment_amount,
          payment_method: detailsData.payment_method,
          payment_notes: detailsData.payment_notes,
          actual_people: detailsData.actual_people,
          actual_duration: detailsData.actual_duration,
          services_provided: detailsData.services_provided,
          additional_services: detailsData.additional_services,
          completion_notes: detailsData.completion_notes,
          client_feedback: detailsData.client_feedback,
          client_rating: detailsData.client_rating,
          photos_uploaded: detailsData.photos_uploaded,
          photo_urls: detailsData.photo_urls,
          before_after_photos: detailsData.before_after_photos,
          workers_involved: detailsData.workers_involved,
          worker_payments: detailsData.worker_payments,
          profit_margin: detailsData.profit_margin,
          travel_distance: detailsData.travel_distance,
          travel_cost: detailsData.travel_cost,
          product_cost: detailsData.product_cost,
          follow_up_required: detailsData.follow_up_required,
          follow_up_date: detailsData.follow_up_date,
          follow_up_notes: detailsData.follow_up_notes
        }
      ])
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error updating booking details:', error)
    return { success: false, error: error.message }
  }
}

// Delete booking details
export const deleteBookingDetails = async (bookingId) => {
  try {
    const { error } = await supabase
      .from('booking_details')
      .delete()
      .eq('booking_id', bookingId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting booking details:', error)
    return { success: false, error: error.message }
  }
}

// Get all booking details with booking information
export const getAllBookingDetailsWithBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('booking_details')
      .select(`
        *,
        bookings (
          id,
          name,
          phone,
          service,
          date,
          time,
          status,
          service_price,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching all booking details:', error)
    return { success: false, error: error.message }
  }
}
