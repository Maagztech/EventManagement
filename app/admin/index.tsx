import EventAddandEdit from "@/components/events/EventAddandEdit";
import { useAuth } from "@/context/authContext";
import { useEventContext } from "@/context/eventContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const { access_token }: any = useAuth();
  interface Event {
    id: number;
    image: string[];
    title: string;
    description: string;
    date: string;
    location: string;
    price: number;
    seats: number;
    category: string[];
  }

  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get("https://eventsapi-umam.onrender.com/api/events", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setEvents(response.data);
    };
    fetchEvents();
  }, []);
  const { selectedEvent, setSelectedEvent }: any = useEventContext();
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setOpen(true);
  };
  const [open, setOpen] = useState(false);
  const handleEditEvent = (eventId: number) => {
    const event = events.find((event) => event.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setOpen(true);
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    const event = events.find((event) => event.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setOpen(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Pressable
        onPress={handleAddEvent}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>Add Event</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.eventList}>
        {events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image[0] }} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text>{event.description}</Text>
            <Text>{`Date: ${event.date}`}</Text>
            <Text>{`Location: ${event.location}`}</Text>
            <Text>{`Price: ${event.price}`}</Text>
            <Text>{`Seats: ${event.seats}`}</Text>
            <Text>{`Category: ${event.category.join(", ")}`}</Text>

            <Pressable
              onPress={() => handleEditEvent(event.id)}
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.buttonText}>Edit Event</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDeleteEvent(event.id)}
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.buttonText}>Delete Event</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <EventAddandEdit isOpen={open} setIsOpen={setOpen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addButton: {
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  eventList: {
    paddingBottom: 20,
  },
  eventCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  eventImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
