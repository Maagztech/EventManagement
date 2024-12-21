import { useAuth } from "@/context/authContext";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index({}) {
  const { getUserInfo }: any = useAuth();
  const [userInfo, setUserInfo] = React.useState({
    userName: "",
    password: "",
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication</Text>
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={userInfo.userName}
        onChangeText={(e) => setUserInfo({ ...userInfo, userName: e })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={userInfo.password}
        onChangeText={(e) => setUserInfo({ ...userInfo, password: e })}
        secureTextEntry
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          
          getUserInfo(userInfo);
        }}
      >
        <Text style={styles.buttonText}>Sign In / Sign Up</Text>
      </Pressable>
      <Text style={styles.link}>
        User Name should contain Letter and Digits.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#007BFF",
    fontSize: 12,
  },
});
