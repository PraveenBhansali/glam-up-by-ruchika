import { supabase } from '../supabase.js'

// Create a new service
export const createService = async (serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          name: serviceData.name,
          client_price: serviceData.clientPrice,
          description: serviceData.description,
          is_active: true
        }
      ])
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error creating service:', error)
    return { success: false, error: error.message }
  }
}

// Get all active services
export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching services:', error)
    return { success: false, error: error.message }
  }
}

// Update a service
export const updateService = async (id, serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update({
        name: serviceData.name,
        client_price: serviceData.clientPrice,
        description: serviceData.description
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error updating service:', error)
    return { success: false, error: error.message }
  }
}

// Delete a service (soft delete by setting is_active to false)
export const deleteService = async (id) => {
  try {
    const { error } = await supabase
      .from('services')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting service:', error)
    return { success: false, error: error.message }
  }
}
