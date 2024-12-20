import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { KeyboardTypeOptions } from "react-native";

const LabeledInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  keyboardType = "default" as KeyboardTypeOptions,
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={[styles.input, style]}
      keyboardType={keyboardType}
      multiline={true}
      numberOfLines={3}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    position: "relative",
  },
  inputLabel: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    fontSize: 12,
    color: "#966440",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderColor: "#966440",
    borderWidth: 1,
    color: "#000",
  },
});

export default LabeledInput;
