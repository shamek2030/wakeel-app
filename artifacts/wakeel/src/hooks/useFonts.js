import {
  useFonts as useExpoFonts,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_900Black,
} from '@expo-google-fonts/cairo';
import { Tajawal_400Regular, Tajawal_700Bold } from '@expo-google-fonts/tajawal';

export function useAppFonts() {
  const [loaded, error] = useExpoFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_900Black,
    Tajawal_400Regular,
    Tajawal_700Bold,
  });
  return [loaded, error];
}

export default useAppFonts;
