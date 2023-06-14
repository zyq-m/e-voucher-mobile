import { useState, useEffect } from "react";
import { Text, View, Platform } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import moment from "moment";

import { Refresh, FilterList, TransactionList } from "../components";

import { useUserContext, useTransaction } from "../hooks";
import { listData } from "../data/constant";
import { getTransactionsByDate } from "../lib/API/getTransactionByDate";

import { globals, transactionStyle } from "../styles";

const Transaction = ({ navigation }) => {
  const [collapse, setCollapse] = useState(false);
  const { user } = useUserContext();
  const { transactions, loading, error } = useTransaction({
    id: user.id,
    student: user.student,
    refresh: user.transaction.refresh,
  });

  const [list, setList] = useState(listData);
  const [filterTransaction, setFilterTransaction] = useState([]);

  const onCollapse = () => setCollapse(prev => !prev);

  const onList = async id => {
    const dateFormat = "YYYY-MM-DD";

    try {
      if (id == 1) {
        const today = moment().format(dateFormat);
        const res = await getTransactionsByDate(
          user.student,
          user.id,
          today,
          today
        );

        setFilterTransaction(res);
      } else if (id == 2) {
        const start = moment().startOf("week").format(dateFormat);
        const end = moment().endOf("week").format(dateFormat);
        const res = await getTransactionsByDate(
          user.student,
          user.id,
          start,
          end
        );

        setFilterTransaction(res);
      } else if (id == 3) {
        const start = moment().startOf("month").format(dateFormat);
        const end = moment().endOf("month").format(dateFormat);
        const res = await getTransactionsByDate(
          user.student,
          user.id,
          start,
          end
        );

        setFilterTransaction(res);
      } else {
        setFilterTransaction(transactions);
      }
    } catch (error) {
      setFilterTransaction([]);
    }

    return setList(prev =>
      prev.map(data => {
        if (data.id === id) {
          return { ...data, checked: true };
        } else {
          return { ...data, checked: false };
        }
      })
    );
  };

  useEffect(() => {
    setFilterTransaction(transactions);
  }, [transactions]);

  useEffect(() => {
    let subscribe = true;
    const header = async () => {
      if (subscribe) {
        navigation.setOptions({
          headerRight: () => (
            <View style={transactionStyle.row}>
              <MaterialIcon
                name="filter-list"
                size={25}
                onPress={onCollapse}
                style={Platform.OS === "web" && { marginRight: 11 }}
              />
            </View>
          ),
        });
      }
    };

    header();

    return () => {
      subscribe = false;
    };
  }, []);

  if (loading) {
    return (
      <>
        <Refresh transaction={true} />
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontWeight: "500",
            color: "rgba(132, 132, 132, 1)",
          }}>
          {error ? error : "Loading.."}
        </Text>
      </>
    );
  }

  return (
    <View style={[globals.container]}>
      <Refresh transaction={true} style={{ paddingBottom: 24 }}>
        <TransactionList
          data={filterTransaction}
          navigation={navigation}
          user={user}
          border={true}
          style={transactionStyle.transactionItemWrap}
        />
      </Refresh>
      {filterTransaction?.length < 1 && (
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontWeight: "500",
            color: "rgba(132, 132, 132, 1)",
          }}>
          No transactions history
        </Text>
      )}
      {collapse && (
        <FilterList
          onCollapse={onCollapse}
          list={list}
          onList={onList}
          document={filterTransaction}
        />
      )}
    </View>
  );
};

export default Transaction;
