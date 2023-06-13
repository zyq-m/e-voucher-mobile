import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from "react-native";

import { createFeedback } from "../lib/API";
import { useUserContext } from "../hooks";
import { Button } from "../components";
import { popupMessage } from "../utils/popupMessage";

import { globals, loginStyle } from "../styles";

const Report = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { user } = useUserContext();

  const handleSend = () => {
    if (title !== "") {
      createFeedback(user.id, title, desc)
        .then(() => {
          if (Platform.OS === "web") {
            alert("Thank you for your feedback");
          } else {
            Alert.alert("Success", "Thank you for your feedback");
          }
          navigation.navigate("Dashboard");
        })
        .then(() => {
          setTitle("");
          setDesc("");
        })
        .catch(() => {
          popupMessage({
            title: "Request timeout",
            message: "Please try again",
          });
        });
    } else {
      popupMessage({
        title: "Important",
        message: "Please describe your comment",
      });
    }
  };

  return (
    <View style={globals.container}>
      <View style={{ padding: 16 }}>
        <Para>Title</Para>
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="I want new feature"
        />
        <Para>Comment</Para>
        <Input
          value={desc}
          onChangeText={setDesc}
          multiline
          numberOfLines={4}
        />
        <Button label={"Send"} onPress={handleSend} />
      </View>
    </View>
  );
};

const Para = ({ children, style }) => {
  return <Text style={[aboutStyle.para, style]}>{children}</Text>;
};

const Input = props => {
  return (
    <TextInput
      {...props}
      style={[loginStyle.inputContainer, aboutStyle.form]}
    />
  );
};

const aboutStyle = StyleSheet.create({
  para: {
    marginLeft: 6,
    marginBottom: 6,
  },
  form: {
    marginTop: 0,
    marginBottom: 24,
  },
});

export default Report;
