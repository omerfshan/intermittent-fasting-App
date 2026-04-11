import { FastingPlan } from "@/Data/FastingPlans";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  plan: FastingPlan;
  onPress: () => void;
};

export default function FastingPlanCard({ plan, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.planTitle}>{plan.title}</Text>

      <View style={styles.details}>
        <Text style={styles.planDetail}>• {plan.fast} saatlik oruç</Text>
        <Text style={styles.planDetail}>• {plan.eat} saatlik yeme dönemi</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  planTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  details: {
    gap: 4,
  },
  planDetail: {
    fontSize: 15,
    color: "#555",
  },
});
