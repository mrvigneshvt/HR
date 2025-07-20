type Company = 'sdce' | 'sq';
type ColorTypes = 'bg' | 'card' | 'text';

export class Colors {
  private static colorMap: Record<Company, Record<ColorTypes, string>> = {
    sdce: {
      bg: '#0e5c52',
      card: '#dff3e8',
      text: '#0369a1',
    },
    sq: {
      bg: '#FF7F51',
      card: '#fff4ec',
      text: '#9a3412',
    },
  };

  public static get(comp: Company, type: ColorTypes): string {
    console.log(comp, '  comp///', type);
    return Colors.colorMap[comp][type];
  }
}
