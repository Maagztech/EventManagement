import { useAuth } from "@/context/authContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Registered() {
  const {access_token}: any = useAuth();
  interface Event {
    id: number;
    image: string;
    title: string;
    description: string;
    date: string;
    location: string;
    price: number;
    seats: number;
    category: string;
  }
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const response = await axios.get(
        "https://eventsapi-umam.onrender.com/api/events/registered",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setRegisteredEvents(response.data);
    };
    fetchRegisteredEvents();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        {registeredEvents.map((event, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: event.image }} style={styles.image} />
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Date: </Text>
              {event.date}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Location: </Text>
              {event.location}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Price: </Text>
              {event.price}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Seats: </Text>
              {event.seats}
            </Text>
            <Text style={styles.detail}>
              <Text style={styles.label}>Category: </Text>
              {event.category}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#495057",
  },
});
