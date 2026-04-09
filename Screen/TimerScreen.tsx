import { CircularTimer } from "@/components/CircularTimer";
import { StartButton } from "@/components/StartButton";
import { useTimer } from "@/hooks/useTimer";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TimerScreen() {
  const { isRunning, remaining, progress, toggle } = useTimer();

  return (
    <View style={styles.container}>
      <CircularTimer progress={progress} remaining={remaining} />
      <StartButton isRunning={isRunning} onPress={toggle} />
      <TouchableOpacity onPress={() => router.push("/modals/fasting-plan")}>
        <Text style={styles.planText}>16-8 planını değiştir ✏️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    backgroundColor: "#0F0F14",
  },
  planText: {
    fontSize: 14,
    color: "#6B7280",
    textDecorationLine: "underline",
  },
});
