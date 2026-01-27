import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  LogOut, 
  Package,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface MockOrder {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  items: number;
}

const STORAGE_KEY = 'stride_admin_orders';

const getInitialOrders = (): MockOrder[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Generate mock orders
  const mockOrders: MockOrder[] = [
    {
      id: '1',
      orderNumber: 'STR-001',
      customer: 'John Doe',
      email: 'john@example.com',
      total: 259.99,
      status: 'pending',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      items: 2,
    },
    {
      id: '2',
      orderNumber: 'STR-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      total: 189.50,
      status: 'processing',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      items: 1,
    },
    {
      id: '3',
      orderNumber: 'STR-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      total: 450.00,
      status: 'shipped',
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      items: 3,
    },
    {
      id: '4',
      orderNumber: 'STR-004',
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      total: 125.00,
      status: 'delivered',
      date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      items: 1,
    },
    {
      id: '5',
      orderNumber: 'STR-005',
      customer: 'Chris Brown',
      email: 'chris@example.com',
      total: 320.75,
      status: 'pending',
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      items: 2,
    },
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrders));
  return mockOrders;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-500/10 text-blue-600', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-500/10 text-purple-600', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-600', icon: CheckCircle },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check admin session
    const session = localStorage.getItem('stride_admin_session');
    if (!session) {
      navigate('/admin');
      return;
    }
    
    setIsAuthenticated(true);
    setOrders(getInitialOrders());
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('stride_admin_session');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/admin');
  };

  const toggleDeliveryStatus = (orderId: string) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.map((order) => {
        if (order.id === orderId) {
          const newStatus = order.status === 'delivered' ? 'pending' : 'delivered';
          return { ...order, status: newStatus as MockOrder['status'] };
        }
        return order;
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    toast({
      title: 'Status Updated',
      description: 'Order delivery status has been updated.',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  // Calculate stats
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map((o) => o.email)).size;

  const stats = [
    {
      label: 'Total Sales',
      value: `$${totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Total Users',
      value: uniqueCustomers.toString(),
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold">Admin Dashboard</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl font-bold">Recent Orders</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track all customer orders
            </p>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-border">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              
              return (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{order.orderNumber}</span>
                    <Badge className={`${status.color} gap-1`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{order.customer}</p>
                    <p>{order.email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Delivered</span>
                      <Switch
                        checked={order.status === 'delivered'}
                        onCheckedChange={() => toggleDeliveryStatus(order.id)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Order</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Items</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Delivered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{order.orderNumber}</td>
                      <td className="p-4">
                        <p>{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">{order.items}</td>
                      <td className="p-4 font-medium">${order.total.toFixed(2)}</td>
                      <td className="p-4">
                        <Badge className={`${status.color} gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Switch
                          checked={order.status === 'delivered'}
                          onCheckedChange={() => toggleDeliveryStatus(order.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
