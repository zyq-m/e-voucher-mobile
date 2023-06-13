import { View, Text, TextInput, Platform } from "react-native";
import loginStyle from "../styles/loginStyle";

const Input = ({ label, secure, onChange, value }) => {
  return (
    <View style={loginStyle.inputContainer}>
      <Text style={loginStyle.inputLabel}>{label}</Text>
      <TextInput
        style={[
          loginStyle.input,
          Platform.OS === "web" && { outlineStyle: "none" },
        ]}
        secureTextEntry={secure ? true : false}
        onChangeText={onChange}
        value={value}
      />
    </View>
  );
};

export default Input;
