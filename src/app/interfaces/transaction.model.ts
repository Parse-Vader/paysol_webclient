export interface TransactionModel{
  id:  string,
  contract: number,
  message: string,
  amount: number,
  sender: string,
  receiver: string,
  finalised: boolean,
  deepLink: string,
  date: Date
}
