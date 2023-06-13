import { StyleSheet } from "react-native";

const transactionStyle = StyleSheet.create({
  transactionItemWrap: {
    marginTop: 6,
    borderRadius: 9,
    borderColor: "rgba(0, 0, 0, 0.11)",
    borderWidth: 1,
    overflow: "hidden",
  },
  fitlerIcon: {
    width: 29,
    height: 29,
    marginRight: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  printIcon: {
    width: 20,
    height: 18,
    marginRight: 12,
  },
});

export default transactionStyle;
