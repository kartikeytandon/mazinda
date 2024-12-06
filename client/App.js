import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function App() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('send'); // default send transaction

  useEffect(() => {
    // Fetch wallet balance from backend
    axios.get('http://localhost:5000/api/wallet')
      .then(response => setBalance(response.data.balance))
      .catch(error => console.error(error));

    // Fetch transaction history
    axios.get('http://localhost:5000/api/transactions')
      .then(response => setTransactions(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleTransaction = () => {
    axios.post('http://localhost:5000/api/transactions', {
      amount: parseFloat(amount),
      category,
      type,
    })
      .then(response => {
        setTransactions([...transactions, response.data]);
        setBalance(response.data.newBalance);
        setAmount('');
        setCategory('');
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Wallet Balance: ${balance}</Text>
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Category (e.g., food, salary)"
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <TouchableOpacity onPress={handleTransaction} style={{ marginBottom: 20 }}>
        <Text>Add Transaction</Text>
      </TouchableOpacity>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.category}: {item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
}