import React from "react";
import { View, StyleSheet } from "react-native";

const TransactionContainer = ({ children }) => {
  return <View style={container.transactionContainer}>{children}</View>;
};

const container = StyleSheet.create({
  transactionContainer: {
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 9,
    borderColor: "rgba(0, 0, 0, 0.11)",
    borderWidth: 1,
  },
});

export default TransactionContainer;
