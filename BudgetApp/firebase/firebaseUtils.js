import { db } from './firebaseConfig';

export const addExpense = async (expense) => {
  await addDoc(collection(db, 'expenses'), expense);
};

export const addIncome = async (income) => {
  await addDoc(collection(db, 'income'), income);
};