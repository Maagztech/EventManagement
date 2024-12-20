import { useAuth } from "@/context/authContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import LabeledInput from "./LabeledInput";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const RegisterForEvent = ({ isOpen, setIsOpen, setLoading, id }: any) => {
  const modalHeight = useRef(new Animated.Value(SCREEN_HEIGHT * 0.56)).current;
  const { access_token }: any = useAuth();
  const [registered, setRegistered] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const closeModal = () => {
    setUserData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
    });
    setIsOpen(false);
  };

  const canSignUp = () => {
    return (
      userData.firstName &&
      userData.lastName &&
      userData.email &&
      userData.mobile
    );
  };

  const handleAddProduct = async () => {
    if (!canSignUp()) {
      Toast.show({
        type: "info",
        text1: "Editing",
        text2: "Updating the product details.",
      });
      return;
    }
    try {
      if (setLoading) {
        setLoading(true);
      }
      const productPayload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        mobile: userData.mobile,
        eventId: id,
      };

      await axios.post(
        `http://localhost:5000/api/events/register`,
        productPayload,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      setRegistered(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.background} onPress={closeModal} />
        <Animated.View style={[styles.modalContainer, { height: modalHeight }]}>
          <View style={styles.handleBar} />
          {!registered ? (
            <ScrollView contentContainerStyle={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Register For Event</Text>
                <LabeledInput
                  label="First Name"
                  value={userData.firstName}
                  onChangeText={(value: string) =>
                    setUserData((prevData) => ({ ...prevData, firstName: value }))
                  }
                />
                <LabeledInput
                  label="Last Name"
                  value={userData.lastName}
                  onChangeText={(value: string) =>
                    setUserData((prevData) => ({ ...prevData, lastName: value }))
                  }
                />
                <LabeledInput
                  label="Email ID"
                  value={userData.email}
                  onChangeText={(value: string) =>
                    setUserData((prevData) => ({ ...prevData, email: value }))
                  }
                />
                <LabeledInput
                  label="Mobile Number"
                  value={userData.mobile}
                  onChangeText={(value: string) =>
                    setUserData((prevData) => ({ ...prevData, mobile: value }))
                  }
                />
                <TouchableOpacity
                  style={[styles.fullButton, styles.addButton]}
                  onPress={handleAddProduct}
                >
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalContent,
                  { paddingVertical: 50, alignItems: "center" },
                ]}
              >
                <Ionicons name="checkmark-circle" size={100} color="#966440" />
                <Text style={styles.modalTitle}>Registered Successfully</Text>
              </View>
            </View>
          )}
        </Animated.View>
        <Toast />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginVertical: 4,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "95%",
    maxWidth: 700,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#966440",
    borderRadius: 5,
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: "#966440",
    paddingVertical: 16,
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  fullButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#2980B9",
  },
  addButton: {
    backgroundColor: "#966440",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageThumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 10,
    marginBottom: 20,
  },
  subsubTitle: {
    fontSize: 10,
  },
  buyOptionContainer: {
    flexDirection: "row",
    marginBottom: 10,
    width: "100%",
  },
  buyOptionInput: {
    borderWidth: 1,
    borderColor: "#966440",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
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
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  deleteImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#966440",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 7,
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    marginTop: 10,
  },
  dropdownContainer: {
    maxHeight: 500, // Limits height of the dropdown container
    width: "100%", // Ensures the dropdown takes full width
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
    overflow: "scroll", // Ensures scroll view respects container bounds
    marginBottom: 14,
  },

  dropdown: {
    width: "100%", // Matches parent width
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    position: "absolute",
    right: 10,
  },
});

export default RegisterForEvent;
