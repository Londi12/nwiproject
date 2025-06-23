import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Lead } from '../entities/Lead'

// Lead service with Supabase integration
export const leadService = {
  async create(leadData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert([{
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            source: leadData.source,
            status: leadData.status || 'New',
            interest_area: leadData.interest_area,
            notes: leadData.notes,
            assigned_to: leadData.assigned_to
          }])
          .select()
          .single()

        if (error) {
          console.error('Supabase error creating lead:', error)
          throw error
        }

        return data
      } catch (error) {
        console.error('Error creating lead in Supabase:', error)
        // Fallback to mock behavior
        return Lead.create(leadData)
      }
    } else {
      // Use mock Lead class
      return Lead.create(leadData)
    }
  },

  async getAll(filters = {}) {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('leads').select('*')

        // Apply filters
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        if (filters.source) {
          query = query.eq('source', filters.source)
        }
        if (filters.assigned_to) {
          query = query.eq('assigned_to', filters.assigned_to)
        }
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
        }

        // Order by created_at desc
        query = query.order('created_at', { ascending: false })

        const { data, error } = await query

        if (error) {
          console.error('Supabase error fetching leads:', error)
          throw error
        }

        return data || []
      } catch (error) {
        console.error('Error fetching leads from Supabase:', error)
        // Fallback to mock data
        return Lead.getMockData()
      }
    } else {
      // Use mock Lead class
      return Lead.getAll(filters)
    }
  },

  async getById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Supabase error fetching lead:', error)
          throw error
        }

        return data
      } catch (error) {
        console.error('Error fetching lead from Supabase:', error)
        throw error
      }
    } else {
      // Use mock Lead class
      return Lead.getById(id)
    }
  },

  async update(id, updateData) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Supabase error updating lead:', error)
          throw error
        }

        return data
      } catch (error) {
        console.error('Error updating lead in Supabase:', error)
        throw error
      }
    } else {
      // Use mock Lead class
      const lead = await Lead.getById(id)
      return lead.update(updateData)
    }
  },

  async delete(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('leads')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Supabase error deleting lead:', error)
          throw error
        }

        return true
      } catch (error) {
        console.error('Error deleting lead from Supabase:', error)
        throw error
      }
    } else {
      // Use mock Lead class
      const lead = await Lead.getById(id)
      return lead.delete()
    }
  },

  // Get statistics for dashboard
  async getStats() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('status, source, created_at')

        if (error) {
          console.error('Supabase error fetching lead stats:', error)
          throw error
        }

        // Calculate stats
        const total = data.length
        const newLeads = data.filter(lead => lead.status === 'New').length
        const qualified = data.filter(lead => lead.status === 'Qualified').length
        const converted = data.filter(lead => lead.status === 'Converted').length

        // This month's leads
        const thisMonth = new Date()
        thisMonth.setDate(1)
        const thisMonthLeads = data.filter(lead => 
          new Date(lead.created_at) >= thisMonth
        ).length

        return {
          total,
          new: newLeads,
          qualified,
          converted,
          thisMonth: thisMonthLeads,
          conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : 0
        }
      } catch (error) {
        console.error('Error fetching lead stats from Supabase:', error)
        // Return mock stats
        return {
          total: 15,
          new: 5,
          qualified: 3,
          converted: 2,
          thisMonth: 8,
          conversionRate: 13.3
        }
      }
    } else {
      // Return mock stats
      return {
        total: 15,
        new: 5,
        qualified: 3,
        converted: 2,
        thisMonth: 8,
        conversionRate: 13.3
      }
    }
  }
}

export default leadService
