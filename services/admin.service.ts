import axiosInstance from "./axios"

export interface User {
  email: string
  full_name: string
  phone_number: string
  location: string | null
  user_id: number
  role: string
  created_at: string
  slug: string
  avatar: string
  background_image: string
  is_active: boolean
}

export interface UsersResponse {
  total: number
  users: User[]
}

export const AdminService = {
  // Lấy danh sách người dùng
  async getUsers(params: {
    page: number
    limit: number
    role?: string
    status?: string
    search?: string
  }): Promise<UsersResponse> {
    try {
      const response = await axiosInstance.get('/admin/users', {
        params: {
          page: params.page,
          limit: params.limit,
          ...(params.role && { role: params.role }),
          ...(params.status && { status: params.status }),
          ...(params.search && { search: params.search }),
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Xóa người dùng
  async deleteUser(userId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Xóa nhiều người dùng
  async deleteUsers(userIds: number[]): Promise<void> {
    try {
      await axiosInstance.delete('/admin/users/bulk-delete', {
        data: { user_ids: userIds }
      })
    } catch (error) {
      console.error('Error deleting users:', error)
      throw error
    }
  },

  // Cập nhật trạng thái người dùng
  async updateUserStatus(userId: number, isActive: boolean): Promise<void> {
    try {
      await axiosInstance.patch(`/admin/users/${userId}/status`, {
        is_active: isActive
      })
    } catch (error) {
      console.error('Error updating user status:', error)
      throw error
    }
  },

  // Xuất dữ liệu người dùng
  async exportUsers(): Promise<Blob> {
    try {
      const response = await axiosInstance.get('/admin/users/export', {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting users:', error)
      throw error
    }
  }
} 