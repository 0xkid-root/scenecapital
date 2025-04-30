"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderManagement } from "@/components/investment/order-management";
import { OrderHistory } from "@/components/investment/order-history";

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>
      <Tabs defaultValue="place-order" className="space-y-4">
        <TabsList>
          <TabsTrigger value="place-order">Place Order</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="place-order" className="space-y-4">
          <OrderManagement />
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <OrderHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}