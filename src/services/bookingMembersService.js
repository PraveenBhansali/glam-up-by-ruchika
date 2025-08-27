import { supabase } from '../supabase.js'

// Create a new booking member
export const createBookingMember = async (bookingId, memberData) => {
  try {
    const { data, error } = await supabase
      .from('booking_members')
      .insert([
        {
          booking_id: bookingId,
          member_name: memberData.member_name,
          member_relation: memberData.member_relation || '',
          member_age: memberData.member_age || null,
          service_provided: memberData.service_provided,
          service_price: memberData.service_price || 0,
          worker_assigned: memberData.worker_assigned || '',
          occasion: memberData.occasion || '',
          occasion_date: memberData.occasion_date || null,
          occasion_time: memberData.occasion_time || null,
          makeup_type: memberData.makeup_type || '',
          additional_services: memberData.additional_services || [],
          products_used: memberData.products_used || [],
          service_start_time: memberData.service_start_time || null,
          service_end_time: memberData.service_end_time || null,
          service_duration: memberData.service_duration || null,
          member_satisfaction: memberData.member_satisfaction || null,
          member_feedback: memberData.member_feedback || '',
          special_requests: memberData.special_requests || '',
          before_photo_url: memberData.before_photo_url || '',
          after_photo_url: memberData.after_photo_url || '',
          process_photos: memberData.process_photos || [],
          cost_breakdown: memberData.cost_breakdown || {},
          profit_margin: memberData.profit_margin || null,
          service_notes: memberData.service_notes || '',
          member_notes: memberData.member_notes || '',
          follow_up_required: memberData.follow_up_required || false,
          follow_up_notes: memberData.follow_up_notes || ''
        }
      ])
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error creating booking member:', error)
    return { success: false, error: error.message }
  }
}

// Get all members for a booking
export const getBookingMembers = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from('booking_members')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching booking members:', error)
    return { success: false, error: error.message }
  }
}

// Update a booking member
export const updateBookingMember = async (memberId, memberData) => {
  try {
    const { data, error } = await supabase
      .from('booking_members')
      .update({
        member_name: memberData.member_name,
        member_relation: memberData.member_relation,
        member_age: memberData.member_age,
        service_provided: memberData.service_provided,
        service_price: memberData.service_price,
        worker_assigned: memberData.worker_assigned,
        occasion: memberData.occasion,
        occasion_date: memberData.occasion_date,
        occasion_time: memberData.occasion_time,
        makeup_type: memberData.makeup_type,
        additional_services: memberData.additional_services,
        products_used: memberData.products_used,
        service_start_time: memberData.service_start_time,
        service_end_time: memberData.service_end_time,
        service_duration: memberData.service_duration,
        member_satisfaction: memberData.member_satisfaction,
        member_feedback: memberData.member_feedback,
        special_requests: memberData.special_requests,
        before_photo_url: memberData.before_photo_url,
        after_photo_url: memberData.after_photo_url,
        process_photos: memberData.process_photos,
        cost_breakdown: memberData.cost_breakdown,
        profit_margin: memberData.profit_margin,
        service_notes: memberData.service_notes,
        member_notes: memberData.member_notes,
        follow_up_required: memberData.follow_up_required,
        follow_up_notes: memberData.follow_up_notes
      })
      .eq('id', memberId)
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error updating booking member:', error)
    return { success: false, error: error.message }
  }
}

// Delete a booking member
export const deleteBookingMember = async (memberId) => {
  try {
    const { error } = await supabase
      .from('booking_members')
      .delete()
      .eq('id', memberId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting booking member:', error)
    return { success: false, error: error.message }
  }
}

// Get all booking members with booking information
export const getAllBookingMembersWithBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('booking_members')
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
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching all booking members:', error)
    return { success: false, error: error.message }
  }
}

// Get member statistics for a booking
export const getBookingMemberStats = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from('booking_members')
      .select('service_price, member_satisfaction, service_duration')
      .eq('booking_id', bookingId)

    if (error) throw error
    
    const stats = {
      total_members: data.length,
      total_revenue: data.reduce((sum, member) => sum + (member.service_price || 0), 0),
      average_satisfaction: data.length > 0 
        ? data.filter(m => m.member_satisfaction).reduce((sum, m) => sum + m.member_satisfaction, 0) / data.filter(m => m.member_satisfaction).length 
        : 0,
      total_duration: data.reduce((sum, member) => sum + (member.service_duration || 0), 0)
    }
    
    return { success: true, data: stats }
  } catch (error) {
    console.error('Error fetching booking member stats:', error)
    return { success: false, error: error.message }
  }
}
