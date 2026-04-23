import { useRouter } from 'expo-router';
import { IPlan } from '../../Interface/IPlans';
import PlanSelectScreen from '../../Screen/PlanSelectScreen';

export default function PlanSelectRoute() {
  const router = useRouter();

  const handleConfirm = (plan: IPlan) => {
    router.back();
  };

  return (
    <PlanSelectScreen
      onClose={() => router.back()}
      onConfirm={handleConfirm}
    />
  );
}
