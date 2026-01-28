import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  status: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const useOrderTracking = (
  orders: Order[],
  onOrderUpdate: (orderId: string, newStatus: string) => void
) => {
  const { toast } = useToast();
  const previousStatusRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    // Initialize previous status map
    orders.forEach((order) => {
      if (!previousStatusRef.current.has(order.id)) {
        previousStatusRef.current.set(order.id, order.status);
      }
    });

    // Subscribe to realtime changes on orders table
    const channel = supabase
      .channel('order-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          const previousStatus = previousStatusRef.current.get(updatedOrder.id);

          // Only notify if status actually changed
          if (previousStatus && previousStatus !== updatedOrder.status) {
            const oldLabel = statusLabels[previousStatus] || previousStatus;
            const newLabel = statusLabels[updatedOrder.status] || updatedOrder.status;

            toast({
              title: '📦 Order Status Updated',
              description: `Order ${updatedOrder.order_number} changed from ${oldLabel} to ${newLabel}`,
            });

            // Update the previous status
            previousStatusRef.current.set(updatedOrder.id, updatedOrder.status);

            // Callback to update parent state
            onOrderUpdate(updatedOrder.id, updatedOrder.status);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orders, onOrderUpdate, toast]);

  // Update ref when orders change
  useEffect(() => {
    orders.forEach((order) => {
      previousStatusRef.current.set(order.id, order.status);
    });
  }, [orders]);
};
