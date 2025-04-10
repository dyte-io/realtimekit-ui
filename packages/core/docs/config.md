# UI Config

You can take a look at the [Default UI Config](../src/lib/default-ui-config.ts) for reference.

The UI is divided into three parts:

1. Design Tokens
2. Styles
3. Tree/Root

## Design Tokens

Users can define the tokens in the UI from here.

| Property       | Default     | Note                                                                                         |
| -------------- | ----------- | -------------------------------------------------------------------------------------------- |
| `spacingBase`  | 4           | The base for the spacing scale                                                               |
| `fontFamily`   | `none`      | Sets a custom font-family                                                                    |
| `googleFont`   | `none`      | Loads and sets a font from [Google Fonts](https://fonts.google.com), example value: `"Lato"` |
| `borderWidth`  | `"thin"`    | Sets a set of border-widths to use app-wide. Values: `none`, `thin`, `fat`                   |
| `borderRadius` | `"rounded"` | `sharp`, `rounded`, `extra-rounded`, `circular`                                              |
| `logo`         | `none`      | A custom logo URL                                                                            |
| `colors`       | `none`      | Color palette                                                                                |

The `colors` property is an object which specifies all the colors required. You can specify only a subset of colors if you just want to update the specific shade as the default colors are merged with this object, so as to fill any missing voids.

```ts
interface UIColors {
  brand?: {
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };
  background?: {
    1000: string;
    900: string;
    800: string;
    700: string;
    600: string;
  };
  text?: string;
  videoBg?: string;
  danger?: string;
  success?: string;
  warning?: string;
}
```

## Styles

You can set your own CSS for RTK components or simple HTML elements which you will use in the tree. You can also set styles for a specific state, or a specific screen size.

Example:

```json
{
  "rtk-meeting": {
    "display": "flex"
  },
  "rtk-meeting.sm": {
    "flexDirection": "column"
  },
  "rtk-meeting[meeting=idle]": {
    "display": "block"
  },
  "div#header-center": {
    "justifyContent": "center"
  }
}
```

## Tree (root)

The tree is the hierarchy of components which the renderer inside `rtk-meeting` will accept and it uses it to render the entire UI.

You can:

- Specify based on states
- Specific screen breakpoints
- Pass props

Each property can be an object, or an array of strings or array.

The object can have `props` and `children`.

The array can have just strings which are the component names, or it can be an array/tuple with first value being the name, the second being an object with props.

Example:

```json
{
  "rtk-meeting[meeting=joined]": ["rtk-header", "rtk-stage", "rtk-controlbar"],
  "rtk-header": {
    "props": {
      "variant": "boxed"
    },
    "children": ["div#header-left", "div#header-center", "div#header-right"]
  },
  "div#header-left": [["rtk-participant-count", { "variant": "boxed" }]]
}
```
