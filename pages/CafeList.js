import { useEffect, useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-radio-buttons-group";

import { Button, Refresh } from "../components";

import { useUserContext } from "../hooks";
import { getCafe } from "../lib/API";
import { ws } from "../lib/Socket";
import { popupMessage } from "../utils/popupMessage";
import { pay } from "../lib/API";

import { globals } from "../styles";

const CafeList = ({ navigation, route }) => {
  const { amount } = route.params;
  const { user } = useUserContext();

  const [radioBtn, setRadioBtn] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState("");

  const onSelected = i =>
    setRadioBtn(prev =>
      prev.map(data => {
        if (data.id == i) {
          setSelectedCafe({ id: data.value, name: data.label });
          return { ...data, selected: true };
        } else {
          return { ...data, selected: false };
        }
      })
    );

  const onPress = async () => {
    try {
      await pay({
        id: selectedCafe.id,
        data: { sender: user.id, amount: amount },
      });

      ws.emit("get_student", user.id);
      ws.emit("get_transaction_student", user.id);

      // update cafe_owner's transaction & sales
      ws.emit("get_transaction_cafe", selectedCafe.id);
      ws.emit("get_sales_amount", selectedCafe.id);

      ws.emit("send_notification", selectedCafe.id, {
        title: "Payment recieved",
        body: `You recieved RM${amount}.00 from ${user.details.name} - ${user.details.id}`,
      });
      ws.emit("send_notification", user.id, {
        title: "Payment sent",
        body: `You spent RM${amount}.00 at ${selectedCafe.name}`,
      });

      popupMessage({ title: "Success", message: "Payment successful👍" });
      navigation.navigate("Dashboard");
    } catch (error) {
      if (error?.response?.status === 400) {
        popupMessage({
          message: "Your account is not active. Please contact admin!",
          title: "Alert!",
        });
      } else {
        popupMessage({
          message: "Server error",
          title: "Whoops!",
        });
      }
    }
  };

  const fetchCafe = signal => {
    getCafe(signal)
      .then(res => {
        let newArr = res.map((data, i) => ({
          id: i,
          label: data.cafe_name,
          value: data.username,
          selected: false,
        }));

        setRadioBtn(newArr);
      })
      .catch(() =>
        popupMessage({
          title: "Error",
          message: "There's a problem please login again",
        })
      );
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchCafe(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    user.cafeList.refresh && fetchCafe();
  }, [user.cafeList.refresh]);

  return (
    <View style={[globals.container]}>
      <Refresh cafeList={true}>
        <View style={{ flex: 1, justifyContent: "center", marginVertical: 16 }}>
          {radioBtn.map(({ id, label, value, selected }) => {
            return (
              <RadioButton
                key={id}
                id={id}
                label={label}
                value={value}
                selected={selected}
                labelStyle={{ fontSize: 16 }}
                containerStyle={{ marginTop: 16 }}
                onPress={() => onSelected(id)}
              />
            );
          })}
        </View>
      </Refresh>
      <View style={{ paddingBottom: 24, paddingHorizontal: 16 }}>
        <Button label={"Confirm"} onPress={onPress} />
      </View>
    </View>
  );
};

export default CafeList;
