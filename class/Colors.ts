type Company = 'sdce' | 'sq';
type ColorTypes = 'bg' | 'card' | 'text';

export class Colors {
  private static colorMap: Record<Company, Record<ColorTypes, string>> = {
    sdce: {
      bg: '#fff',
      card: '#fff',
      text: '#0369a1',
    },
    sq: {
      bg: '#fff7ed',
      card: '#ffedd5',
      text: '#9a3412',
    },
  };

  public static get(comp: Company, type: ColorTypes): string {
    return Colors.colorMap[comp][type];
  }
}
