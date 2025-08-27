import { supabase } from '../supabase.js'

// Create a new worker
export const createWorker = async (workerData) => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .insert([
        {
          name: workerData.name,
          role: workerData.role,
          payment_rate: workerData.paymentRate,
          is_owner: workerData.isOwner || false,
          is_active: true
        }
      ])
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error creating worker:', error)
    return { success: false, error: error.message }
  }
}

// Get all active workers
export const getWorkers = async () => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('is_active', true)
      .order('is_owner', { ascending: false }) // Owner first
      .order('created_at', { ascending: true })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching workers:', error)
    return { success: false, error: error.message }
  }
}

// Update a worker
export const updateWorker = async (id, workerData) => {
  try {
    const { data, error } = await supabase
      .from('workers')
      .update({
        name: workerData.name,
        role: workerData.role,
        payment_rate: workerData.paymentRate,
        is_owner: workerData.isOwner
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error updating worker:', error)
    return { success: false, error: error.message }
  }
}

// Delete a worker (soft delete by setting is_active to false)
export const deleteWorker = async (id) => {
  try {
    const { error } = await supabase
      .from('workers')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting worker:', error)
    return { success: false, error: error.message }
  }
}
