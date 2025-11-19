import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CheckCircle } from "lucide-react-native"; // yarn add lucide-react-native

interface ConnectionSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

export const ConnectionSuccessDialog: React.FC<
  ConnectionSuccessDialogProps
> = ({ open, onOpenChange, message }) => {
  if (!open) return null;

  const handleClose = () => onOpenChange(false);

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <CheckCircle size={32} color="#16a34a" />
          </View>
        </View>

        <Text style={styles.title}>Success!</Text>
        <Text style={styles.description}>{message}</Text>

        <TouchableOpacity style={styles.button} onPress={handleClose}>
          <Text style={styles.buttonText}>Got it!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#ffffff",
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    color: "#4b5563",
    marginTop: 8,
  },
  button: {
    marginTop: 16,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
