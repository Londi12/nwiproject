import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Application } from '../entities/Application'

// Application service with Supabase integration
export const applicationService = {
  async create(applicationData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .insert([{
            client_name: applicationData.client_name,
            email: applicationData.email,
            phone: applicationData.phone,
            visa_type: applicationData.visa_type,
            target_country: applicationData.target_country,
            status: applicationData.status || 'Draft',
            cv_status: applicationData.cv_status || 'Not Uploaded',
            payment_status: applicationData.payment_status || 'Pending',
            payment_amount: applicationData.payment_amount,
            notes: applicationData.notes,
            lead_id: applicationData.lead_id,
            assigned_to: applicationData.assigned_to
          }])
          .select()
          .single()

        if (error) {
          console.error('Supabase error creating application:', error)
          throw error
        }

        return data
      } catch (error) {
        console.error('Error creating application in Supabase:', error)
        // Fallback to mock behavior
        return Application.create(applicationData)
      }
    } else {
      // Use mock Application class
      return Application.create(applicationData)
    }
  },

  async getAll(filters = {}) {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('applications').select('*')

        // Apply filters
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        if (filters.visa_type) {
          query = query.eq('visa_type', filters.visa_type)
        }
        if (filters.target_country) {
          query = query.eq('target_country', filters.target_country)
        }
        if (filters.assigned_to) {
          query = query.eq('assigned_to', filters.assigned_to)
        }
        if (filters.search) {
          query = query.or(`client_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
        }

        // Order by created_at desc
        query = query.order('created_at', { ascending: false })

        const { data, error } = await query

        if (error) {
          console.error('Supabase error fetching applications:', error)
          throw error
        }

        return data || []
      } catch (error) {
        console.error('Error fetching applications from Supabase:', error)
        // Fallback to mock data
        return Application.getMockData()
      }
    } else {
      // Use mock Application class
      return Application.getAll(filters)
    }
  },

  async getById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Supabase error fetching application:', error)
          throw error
        }

        return data
      } catch (error) {
        console.error('Error fetching application from Supabase:', error)
        throw error
      }
    } else {
      // Use mock Application class
      return Application.getById(id)
    }
  },

  async update(id, updateData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Supabase error updating application:', error)
          throw error
        }

        return data
      } catch (error) {
        console.error('Error updating application in Supabase:', error)
        throw error
      }
    } else {
      // Use mock Application class
      const application = await Application.getById(id)
      return application.update(updateData)
    }
  },

  async delete(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Supabase error deleting application:', error)
          throw error
        }

        return true
      } catch (error) {
        console.error('Error deleting application from Supabase:', error)
        throw error
      }
    } else {
      // Use mock Application class
      const application = await Application.getById(id)
      return application.delete()
    }
  },

  // Get statistics for dashboard
  async getStats() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('status, visa_type, target_country, created_at, payment_amount')

        if (error) {
          console.error('Supabase error fetching application stats:', error)
          throw error
        }

        // Calculate stats
        const total = data.length
        const inProgress = data.filter(app => app.status === 'In Progress').length
        const submitted = data.filter(app => app.status === 'Submitted').length
        const approved = data.filter(app => app.status === 'Approved').length

        // This month's applications
        const thisMonth = new Date()
        thisMonth.setDate(1)
        const thisMonthApps = data.filter(app => 
          new Date(app.created_at) >= thisMonth
        ).length

        // Total revenue
        const totalRevenue = data
          .filter(app => app.payment_amount)
          .reduce((sum, app) => sum + parseFloat(app.payment_amount || 0), 0)

        return {
          total,
          inProgress,
          submitted,
          approved,
          thisMonth: thisMonthApps,
          totalRevenue: totalRevenue.toFixed(2),
          approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0
        }
      } catch (error) {
        console.error('Error fetching application stats from Supabase:', error)
        // Return mock stats
        return {
          total: 28,
          inProgress: 12,
          submitted: 8,
          approved: 6,
          thisMonth: 15,
          totalRevenue: '45000.00',
          approvalRate: 21.4
        }
      }
    } else {
      // Return mock stats
      return {
        total: 28,
        inProgress: 12,
        submitted: 8,
        approved: 6,
        thisMonth: 15,
        totalRevenue: '45000.00',
        approvalRate: 21.4
      }
    }
  }
}

export default applicationService
