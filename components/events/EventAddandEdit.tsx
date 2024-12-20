import { useAuth } from "@/context/authContext";
import { useEventContext } from "@/context/eventContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import LabeledInput from "./LabeledInput";
import LabeledMultilineInput from "./LabeledMultilineInput";
type AddEventModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setLoading?: (loading: boolean) => void; // Optional setLoading prop
  fetchEvents: () => void;
};
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const EventAddandEdit = ({
  isOpen,
  setIsOpen,
  setLoading,
  fetchEvents,
}: AddEventModalProps) => {
  const modalHeight = useRef(new Animated.Value(SCREEN_HEIGHT * 0.8)).current;
  const { access_token }: any = useAuth();
  const { selectedEvent, setSelectedEvent }: any = useEventContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const uploadImages = async (eventData: any) => {
    const uploadedImageUrls = await Promise.all(
      eventData.image.map(async (image: string) => {
        if (image.startsWith("http")) return image;
        try {
          const formData = new FormData();
          formData.append("file", {
            uri: image,
            name: `${eventData.title}.jpg`,
            type: "image/jpeg",
          } as any);
          formData.append("upload_preset", "esybulk");
          formData.append("cloud_name", "dv5daoaut");
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dv5daoaut/image/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          return response.data.secure_url;
        } catch (error) {
          console.error("Error uploading image:", error);
          return null; // Return null for failed uploads
        }
      })
    );

    // Filter out null values and add the default image URL if the list is empty
    const validImages = uploadedImageUrls.filter(Boolean) as string[];
    if (validImages.length === 0) {
      validImages.push(
        "https://cdn2.allevents.in/transup/a7/a438d4cf8e4ce8a46141fe7c4ffaa8/ae-christmas-logo.webp"
      );
    }

    return validImages;
  };

  const types = [
    "Corporate Event",
    "Social Event",
    "Entertainment Event",
    "Educational Event",
    "Sports Event",
    "Community Event",
    "Professional Development Event",
    "Tech-Related Event",
    "Other",
  ];
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: [] as string[],
    category: [] as string[],
    date: "",
    location: "",
    price: "",
    seats: "",
  });

  useEffect(() => {
    if (selectedEvent) {
      setEventData({
        title: selectedEvent.title,
        description: selectedEvent.description,
        image: selectedEvent.image, // Add image property
        price: String(selectedEvent.price), // Convert to string
        category: selectedEvent.category,
        location: selectedEvent.location,
        date: selectedEvent.date,
        seats: selectedEvent.seats || "", // Add seats property
      });
    } else {
      setEventData({
        title: "",
        description: "",
        image: [] as string[],
        category: [] as string[],
        date: "",
        location: "",
        price: "",
        seats: "",
      });
    }
  }, [selectedEvent]);

  const closeModal = () => {
    setSelectedEvent(null);
    setIsOpen(false);
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setEventData((prevData) => ({
        ...prevData,
        image: [...prevData.image, ...selectedImages],
      }));
    }
  };

  const canSignUp = () => {
    return (
      eventData.title &&
      eventData.image.length > 0 &&
      eventData.description &&
      eventData.date &&
      !isNaN(Number(eventData.price)) && // Ensure price is a valid number
      Number(eventData.price) > 0 &&
      eventData.category.length > 0 &&
      !isNaN(Number(eventData.seats)) && // Ensure seats is a valid number
      Number(eventData.seats) > 0
    );
  };

  const handleAddEvent = async () => {
    if (!canSignUp()) {
      return;
    }
    setIsOpen(false);
    try {
      if (setLoading) {
        setLoading(true);
      }
      const uploadedImageUrls = await uploadImages(eventData);
      const productPayload = {
        title: eventData.title,
        description: eventData.description,
        image: uploadedImageUrls,
        price: eventData.price,
        seats: eventData.seats,
        category: eventData.category,
        location: eventData.location,
        date: eventData.date,
      };
      if (setLoading) {
        setLoading(false);
      }
      if (selectedEvent) {
        await axios.put(
          `https://eventsapi-umam.onrender.com/api/events/${selectedEvent._id}`,
          productPayload,
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
      } else {
        await axios.post(`https://eventsapi-umam.onrender.com/api/events`, productPayload, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
      }

      setEventData({
        title: "",
        description: "",
        image: [] as string[],
        category: [] as string[],
        date: "",
        location: "",
        price: "",
        seats: "",
      });
    } catch (error) {
      console.log(error);
    }
    fetchEvents();
    closeModal();
  };

  const removeImage = (index: number) => {
    setEventData((prevData) => ({
      ...prevData,
      image: prevData.image.filter((_, i) => i !== index),
    }));
  };

  const handleTypeChange = (type: string) => {
    setEventData((prevData) => {
      const updatedTypes = prevData.category.includes(type)
        ? prevData.category.filter((t) => t !== type)
        : [...prevData.category, type];
      return { ...prevData, category: updatedTypes };
    });
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };
  const [showPicker, setShowPicker] = useState(false);
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
          <ScrollView contentContainerStyle={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Event</Text>
              <Pressable style={styles.imageButton} onPress={pickImages}>
                <Text style={styles.buttonText}>
                  {eventData.image.length > 0
                    ? `${eventData.image.length} Photos Selected`
                    : "Select Photos"}
                </Text>
              </Pressable>
              <FlatList
                horizontal
                data={eventData.image}
                renderItem={({ item, index }) => (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item }}
                      style={styles.imageThumbnail}
                    />
                    <Pressable
                      style={styles.deleteImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="white" />
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <LabeledInput
                label="Event Name"
                value={eventData.title}
                onChangeText={(value: string) =>
                  setEventData((prevData) => ({ ...prevData, title: value }))
                }
              />
              <LabeledMultilineInput
                label="About Event"
                value={eventData.description}
                onChangeText={(value: string) =>
                  setEventData((prevData) => ({
                    ...prevData,
                    description: value,
                  }))
                }
                multiline={3}
              />

              <Pressable
                onPress={handleDropdownToggle}
                style={styles.dropdownBox}
              >
                <Text style={styles.inputLabel}>Event Category</Text>
                <Text>
                  {eventData.category.length > 0
                    ? eventData.category.join(", ")
                    : ""}
                </Text>
                <Ionicons
                  name={showDropdown ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="black"
                  style={styles.icon}
                />
              </Pressable>

              {showDropdown && (
                <View style={styles.dropdownContainer}>
                  <ScrollView style={styles.dropdown}>
                    {types.map((type) => (
                      <View key={type} style={styles.checkboxContainer}>
                        <Checkbox
                          status={
                            eventData.category.includes(type)
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() => handleTypeChange(type)}
                        />
                        <Text>{type}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <LabeledInput
                label="Location"
                value={eventData.location}
                onChangeText={(value: any) =>
                  setEventData((prevData) => ({
                    ...prevData,
                    location: value,
                  }))
                }
              />
              <LabeledInput
                label="Date (YYYY-MM-DD)"
                value={eventData.date}
                onChangeText={(value: any) =>
                  setEventData((prevData) => ({
                    ...prevData,
                    date: value,
                  }))
                }
              />
              <LabeledInput
                label="Price"
                value={eventData.price}
                keyboardType="decimal-pad"
                onChangeText={(value: any) =>
                  setEventData((prevData) => ({
                    ...prevData,
                    price: value.replace(/[^0-9]/g, ""),
                  }))
                }
              />
              <LabeledInput
                label="Seats Available"
                value={String(eventData.seats)}
                keyboardType="numeric"
                onChangeText={(value: any) =>
                  setEventData((prevData) => ({
                    ...prevData,
                    seats: value.replace(/[^0-9]/g, ""), // Remove non-numeric characters
                  }))
                }
              />

              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.fullButton, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.fullButton, styles.addButton]}
                  onPress={handleAddEvent}
                >
                  {!selectedEvent ? (
                    <Text style={styles.buttonText}>Add</Text>
                  ) : (
                    <Text style={styles.buttonText}>Update</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
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
    backgroundColor: "#270e45",
    paddingVertical: 16,
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
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
    height: 45,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
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

export default EventAddandEdit;
