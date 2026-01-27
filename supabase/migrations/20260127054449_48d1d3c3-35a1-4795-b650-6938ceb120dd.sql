-- Add DELETE policy for orders so users can remove their own orders
CREATE POLICY "Users can delete their own orders" 
ON public.orders 
FOR DELETE 
USING (auth.uid() = user_id);