import { FASTING_PLANS, FastingPlan } from "@/Data/FastingPlans";
import { useFastingPlan } from "@/hooks/useFastingPlan";
import { router } from "expo-router";
import {
        ScrollView,
        StyleSheet,
        Text,
        TouchableOpacity,
        View,
} from "react-native";

export default function FastingPlanScreen() {
  const { setSelectedPlan } = useFastingPlan();

  const selectPlan = (plan: FastingPlan) => {
    setSelectedPlan(plan);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Oruç tutmaya başlamak için birini seçin</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {FASTING_PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.card}
            onPress={() => selectPlan(plan)}
          >
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planDetail}>• {plan.fast} saatlik oruç</Text>
            <Text style={styles.planDetail}>
              • {plan.eat} saatlik yeme dönemi
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F0E8" },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    padding: 20,
    paddingTop: 60,
  },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, gap: 8 },
  planTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  planDetail: { fontSize: 15, color: "#555" },
});
