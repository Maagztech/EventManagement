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
    _id: string;
    image: string[];
    title: string;
    description: string;
    date: string;
    location: string;
    price: number;
    seats: number;
    category: string[];
    registeredCount: number;
  }

  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const response = await axios.get("https://eventsapi-umam.onrender.com/api/events", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    setEvents(response.data);
  };

  useEffect(() => {
    if (access_token) fetchEvents();
  }, [access_token]);
  const { selectedEvent, setSelectedEvent }: any = useEventContext();
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setOpen(true);
  };
  const [open, setOpen] = useState(false);
  const handleEditEvent = (eventId: string) => {
    const event = events.find((event) => event._id === eventId);
    if (event) {
      setSelectedEvent(event);
      setOpen(true);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    const deleteEvent = async () => {
      await axios.delete(`https://eventsapi-umam.onrender.com/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setEvents(events.filter((event) => event._id !== eventId));
    };
    deleteEvent();
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
          <View key={event._id} style={styles.eventCard}>
            <Image source={{ uri: event.image[0] }} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text>{event.description}</Text>
            <Text>{`Date: ${event.date.split("T")[0]}`}</Text>
            <Text>{`Location: ${event.location}`}</Text>
            <Text>{`Price: ${event.price}`}</Text>
            <Text>{`Seats: ${event.seats}`}</Text>
            <Text>{`Category: ${event.category.join(", ")}`}</Text>
            <Text>{`Total Registered: ${event.registeredCount}`}</Text>
            <Pressable
              onPress={() => handleEditEvent(event._id)}
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.buttonText}>Edit Event</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDeleteEvent(event._id)}
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
      <EventAddandEdit
        isOpen={open}
        setIsOpen={setOpen}
        fetchEvents={fetchEvents}
      />
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
