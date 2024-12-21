import RegisterForEvent from "@/components/events/RegisterForEvent";
import { useEventContext } from "@/context/eventContext";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

type RouteParams = {
  params: {
    id: string;
  };
};

type Event = {
  _id: string;
  image: string[];
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
  const { madeEvents }: any = useEventContext();
  const handleRegister = () => {
    setOpen(true);
  };
  if (!madeEvents) return null;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FlatList
        data={madeEvents.image}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
      <Text style={styles.title}>{madeEvents.title}</Text>
      <Text style={styles.description}>{madeEvents.description}</Text>
      <Text style={styles.details}>Date: {madeEvents.date.split("T")[0]}</Text>
      <Text style={styles.details}>Location: {madeEvents.location}</Text>
      <Text style={styles.details}>Price: {madeEvents.price}</Text>
      <Text style={styles.details}>Seats: {madeEvents.seats}</Text>
      <Text style={styles.details}>Category: {madeEvents.category.join(", ")}</Text>
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
      <RegisterForEvent isOpen={open} setIsOpen={setOpen} id={id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
