import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import { Button } from "../components";
import { ws } from "../lib/Socket";
import { useUserContext } from "../hooks";
import { checkURL } from "../utils/checkURL";
import { popupMessage } from "../utils/popupMessage";
import { pay } from "../lib/API";

import { QRScanStyle } from "../styles";

const QRScan = ({ navigation, route }) => {
  const { amount } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { user } = useUserContext();

  const handlePermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status === "granted") {
      setHasPermission(true);
    }
  };

  //! api call cannot call directly in QR scanner
  const onPay = async data => {
    const cafeId = checkURL(data);
    if (cafeId) {
      pay({
        id: cafeId.id,
        data: { sender: user.id, amount: amount },
      })
        .then(() => {
          ws.emit("get_student", user.id);
          ws.emit("get_transaction_student", user.id);
          ws.emit("get_transaction_cafe", cafeId.id);
          ws.emit("send_notification", cafeId.id, {
            title: "Payment recieved",
            body: `You recieved RM${amount}.00 from ${user.details.name} - ${user.details.id}`,
          });
          ws.emit("send_notification", user.id, {
            title: "Payment sent",
            body: `You spent RM${amount}.00 at ${cafeId.name}`,
          });

          popupMessage({ title: "Success", message: "Payment successful👍" });
          navigation.navigate("Dashboard");
          // remove socket to avoid looping ascendingly
          ws.removeAllListeners("pay_detail");
        })
        .catch(error => {
          if (error?.response?.status === 400) {
            popupMessage({
              message: "Your account is not active. Please contact admin!",
              title: "Alert!",
            });
            popupMessage({
              message: "Server error",
              title: "Whoops!",
            });
          }
        });
    } else {
      popupMessage({
        title: "Error",
        message: "Invalid QR code. Please scan again.",
      });
    }
  };

  const handleQRScan = ({ data }) => {
    onPay(data);
    setScanned(true);
  };

  useEffect(() => {
    handlePermission();
  }, []);

  return (
    <View style={[{ flex: 1, paddingHorizontal: 16, backgroundColor: "#000" }]}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleQRScan}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={QRScanStyle.scanner}>
          <View style={QRScanStyle.row}>
            <Image
              style={[QRScanStyle.square]}
              source={require("../assets/icons/scanner-icon.png")}
            />
            <Image
              style={[
                QRScanStyle.square,
                { transform: [{ rotateY: "180deg" }] },
              ]}
              source={require("../assets/icons/scanner-icon.png")}
            />
          </View>
          <View style={QRScanStyle.row}>
            <Image
              style={[
                QRScanStyle.square,
                { transform: [{ rotateX: "180deg" }] },
              ]}
              source={require("../assets/icons/scanner-icon.png")}
            />
            <Image
              style={[
                QRScanStyle.square,
                { transform: [{ rotate: "-180deg" }] },
              ]}
              source={require("../assets/icons/scanner-icon.png")}
            />
          </View>
        </View>
      </View>
      <View style={{ paddingBottom: 24 }}>
        <Button label={"Scan again"} onPress={() => setScanned(false)} />
      </View>
    </View>
  );
};

export default QRScan;
