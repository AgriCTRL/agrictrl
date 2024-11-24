import { useState, useEffect } from 'react';

export const useTransactions = (status) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/inventory/enhanced?status=${status}`);
            const data = await response.json();
            setTransactions(data.map(transformTransactionData)); // Move transformation here
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchTransactions();
    }, [status]);

    return { transactions, isLoading };
};

const transformTransactionData = (item) => {
  // Logic to transform the transaction data
};