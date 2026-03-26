export interface OrderItem {
    id: string
    title: string
    size: number
    count: number
  }
  
  export interface Order {
    id: string
    customer: {
      name: string
      address: string
      phone: string
    }
    items: OrderItem[]
    total: number
    status: "pending" | "delivered" | "cancelled"
    createdAt: string
}