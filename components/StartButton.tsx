import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  isRunning: boolean;
  onPress: () => void;
  planName?: string;
};

export const StartButton = ({
  isRunning,
  onPress,
  planName = "16-8",
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isRunning ? styles.stopButton : styles.startButton,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {isRunning ? `${planName} ORUCUNU DURDUR` : `${planName} ORUCUNA BAŞLA`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "85%",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#EF4444",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});
