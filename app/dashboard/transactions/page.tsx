"use client";

// Define filter type
type FilterType = "all" | "completed" | "pending";

// Define transaction interface
interface Transaction {
  id: string;
  type: "completed" | "pending";
  amount: number;
  date: string;
}

// Define props interface
interface TransactionsListProps {
  filter: FilterType;
}

export function TransactionsList({ filter }: TransactionsListProps) {
  // Mock transaction data (replace with actual data fetching)
  const transactions: Transaction[] = [
    { id: "1", type: "completed", amount: 100.50, date: "2025-05-01 10:00" },
    { id: "2", type: "pending", amount: 250.75, date: "2025-05-02 12:30" },
    { id: "3", type: "completed", amount: 180.25, date: "2025-05-02 15:45" },
    { id: "4", type: "pending", amount: 300.00, date: "2025-05-03 09:15" },
  ];

  // Filter transactions based on the selected filter
  const filteredTransactions = transactions.filter(
    (tx) => filter === "all" || tx.type === filter
  );

  return (
    <div className="space-y-4">
      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {tx.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}