import { configFile } from 'config';

interface ColorTypes {
  theme: 'dark' | 'light';
  for: 'main-bg' | 'text' | 'card-bg' | 'main-text';
}

export class Themez {
  public static color(options: ColorTypes) {
    switch (options.theme) {
      case 'dark':
        switch (options.for) {
          case 'card-bg':
            return '#343a40';

          case 'main-bg':
            return 'black';

          case 'main-text':
            return configFile.colorGreen;
        }

      case 'light':
        switch (options.for) {
          case 'card-bg':
            return '#fff';

          case 'main-bg':
            return '#fff';

          case 'main-text':
            return configFile.colorGreen;
        }
    }
  }
}
