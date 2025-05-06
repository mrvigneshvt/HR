import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

const logo = require("../assets/logo.jpg");

export default function Register() {
  const router = useRouter();
  const [aadhar, setAadhar] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const [aadharVerified, setAadharVerified] = useState(false);

  // ... keep the same handler functions ...

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={logo}
            style={{ width: 80, height: 80, borderRadius: 8 }}
            contentFit="contain"
          />
        </View>

        <Text style={styles.title}>Register</Text>

        {!showOTPInput && (
          <>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Aadhar Number"
              maxLength={16}
              placeholderTextColor="#888"
              value={aadhar}
              onChangeText={setAadhar}
            />

            <Pressable style={styles.button} onPress={handleVerifyAadhar}>
              <Text style={styles.buttonText}>Verify</Text>
            </Pressable>
          </>
        )}

        {showOTPInput && (
          <>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter OTP"
              maxLength={6}
              placeholderTextColor="#888"
              value={otp}
              onChangeText={setOTP}
            />

            <Pressable style={styles.button} onPress={handleVerifyOTP}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  formContainer: {
    width: "100%",
    maxWidth: 384, // equivalent to max-w-sm (24rem = 384px)
    borderRadius: 12, // xl rounding
    backgroundColor: "#fff",
    padding: 24, // p-6 (6 * 4 = 24)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
    elevation: 5,
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#238c58",
  },
  input: {
    marginBottom: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#238c58",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "black",
  },
  button: {
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: "#238c58",
    paddingVertical: 8,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
});
