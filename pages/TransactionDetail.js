import { View, Text, StyleSheet } from "react-native";
import React from "react";

import { globals } from "../styles";

const TransactionDetail = ({ route }) => {
  const { data } = route.params

  return (
    <View style={[globals.container, { paddingHorizontal: 16, paddingTop: 16 }]}>
      <List title={"Transaction Id"} child={data.transactionId} />
      <List title={"Sender"} child={data.sender} />
      <List title={"Recipient"} child={data.recipient} />
      <List title={"Date"} child={data.date} />
      <List title={"Amount"} child={data.amount} />
    </View>
  );
};

export default TransactionDetail;

const List = ({ title, child }) => {
  return (
    <View style={transactionDetailsStyle.list}>
      <Text style={transactionDetailsStyle.title}>{title}</Text>
      <Text style={transactionDetailsStyle.child}>{child}</Text>
    </View>
  )
}

const transactionDetailsStyle = StyleSheet.create({
  list: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: "#FFF"
  },
  title: {
    fontSize: 12,
    marginBottom: 18,
    color: "rgba(0,0,0,0.48)",
  },
  child: {
    fontWeight: "500"
  }
})