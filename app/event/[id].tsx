import RegisterForEvent from "@/components/events/RegisterForEvent";
import { RouteProp, useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type RouteParams = {
  params: {
    id: string;
  };
};

type Event = {
  _id: string;
  images: string[];
  title: string;
  description: string;
  date: string;
  location: string;
  price: string;
  seats: string;
  category: string[];
};

export default function Xid() {
  const [event, setEvent] = useState<Event | null>(null);
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { id } = route.params;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchSingleEvent = async () => {
      console.log(id)
      const response = await axios.get(
        "https://eventsapi-umam.onrender.com/api/events/" + id
      );
      setEvent(response.data);
    };
    fetchSingleEvent();
  }, [id]);
  const handleRegister = () => {
    setOpen(true);
  };
  if (!event) return null;
  return (
    <View style={styles.container}>
      <FlatList
        data={event.images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.details}>Date: {event.date}</Text>
      <Text style={styles.details}>Location: {event.location}</Text>
      <Text style={styles.details}>Price: {event.price}</Text>
      <Text style={styles.details}>Seats: {event.seats}</Text>
      <Text style={styles.details}>Category: {event.category}</Text>
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
      <RegisterForEvent isOpen={open} setIsOpen={setOpen} id={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  image: {
    width: 300,
    height: 300,
    marginRight: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: "#6c757d",
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
