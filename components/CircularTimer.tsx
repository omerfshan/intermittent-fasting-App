import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  progress: number;
  remaining: number;
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const CircularTimer = ({ progress, remaining }: Props) => {
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width={260} height={260}>
        <Circle
          cx={130}
          cy={130}
          r={RADIUS}
          stroke="#1E1E2E"
          strokeWidth={14}
          fill="none"
        />
        <Circle
          cx={130}
          cy={130}
          r={RADIUS}
          stroke="#F5C518"
          strokeWidth={14}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="130, 130"
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.timeText}>{formatTime(remaining)}</Text>
        <Text style={styles.label}>kalan süre</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
  },
  timeText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
});
