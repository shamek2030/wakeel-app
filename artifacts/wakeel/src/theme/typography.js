export const FONTS = {
  regular:       'Cairo_400Regular',
  medium:        'Cairo_500Medium',
  semibold:      'Cairo_600SemiBold',
  bold:          'Cairo_700Bold',
  black:         'Cairo_900Black',
  secondary:     'Tajawal_400Regular',
  secondaryBold: 'Tajawal_700Bold',
};

export const SIZES = { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, hero: 36 };

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicNumerals(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

export function formatHijriDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return toArabicNumerals(date.toLocaleDateString());
  }
}

export function formatGregorianDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return toArabicNumerals(date.toLocaleDateString());
  }
}

export default FONTS;
