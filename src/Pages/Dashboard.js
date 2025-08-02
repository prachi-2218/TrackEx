import React, { useEffect } from "react";
import Header from "../Components/Header";
import Cards from "../Components/Cards";
// import { Modal } from "antd";
import { useState } from "react";
import AddExpenseModal from "../Components/Modals/addExpense";
import AddIncomeModal from "../Components/Modals/addIncomet";
import { addDoc,collection,query,getDocs } from "firebase/firestore";
import moment from "moment";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db } from "../firebase";
import TransactionsTable from "../Components/TransactionsTable";


function Dashboard() {
  const[transactions,setTransactions]=useState([]);
  const[loading,setLoading]=useState(false);
  const [user]=useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const[income,setIncome]=useState(0);
  const[expense,setExpense]=useState(0);
  const[currentBalance,setCurrentBalance]=useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  }
 
  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      
        if(!many)toast.success("Transaction Added!");
        let newArr=transactions;
        newArr.push(transaction);
        setTransactions(newArr);
        calculateBalance();
      
    } catch (e) {
      console.error("Error adding document: ", e);
      
      if(!many)toast.error("Couldn't add transaction");
    
    }
  }
  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  useEffect(() => {
    fetchTransactions();
  },[user])

  useEffect(() => {
    calculateBalance();
  }, [transactions])
  
  
  return (
    <div>
      <Header />
      {loading?<p>Loading...</p>:
      <>
      <Cards
        income={income}
        expense={expense}
        currentBalance={currentBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
      />

      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      /></>}
      <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
      
    </div>
  );
}

export default Dashboard;
