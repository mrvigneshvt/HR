// File: /app/404.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NotFound = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Page Not Found</Text>
      <Text style={styles.message}>
        Oops! Looks like you’ve reached a route that doesn't exist.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    color: "gray",
  },
});

export default NotFound;
