import { Color4 } from '@babylonjs/core'

export const stringToColor = (colorString: string): Color4 => {
  if (colorString.startsWith('#')) {
    return Color4.FromHexString(colorString)
  }
  const name = colorString.toLowerCase()
  if (name in webcolors) {
    return webcolors[name as keyof typeof webcolors].clone()
  }
  if (name == 'transparent') {
    return new Color4(0, 0, 0, 0)
  }
  return new Color4(0, 0, 0, 1)
}

const webcolors = {
  // black (r, g, b, a) = (0, 0, 0, 255)
  black: new Color4(0, 0, 0, 1),
  // aliceblue (r, g, b, a) = (240, 248, 255, 255)
  aliceblue: new Color4(0.9411765, 0.972549, 1, 1),
  // darkcyan (r, g, b, a) = (0, 139, 139, 255)
  darkcyan: new Color4(0, 0.54509807, 0.54509807, 1),
  // lightyellow (r, g, b, a) = (255, 255, 224, 255)
  lightyellow: new Color4(1, 1, 0.8784314, 1),
  // coral (r, g, b, a) = (255, 127, 80, 255)
  coral: new Color4(1, 0.49803922, 0.3137255, 1),
  // dimgray (r, g, b, a) = (105, 105, 105, 255)
  dimgray: new Color4(0.4117647, 0.4117647, 0.4117647, 1),
  // lavender (r, g, b, a) = (230, 230, 250, 255)
  lavender: new Color4(0.9019608, 0.9019608, 0.98039216, 1),
  // teal (r, g, b, a) = (0, 128, 128, 255)
  teal: new Color4(0, 0.5019608, 0.5019608, 1),
  // lightgoldenrodyellow (r, g, b, a) = (250, 250, 210, 255)
  lightgoldenrodyellow: new Color4(0.98039216, 0.98039216, 0.8235294, 1),
  // tomato (r, g, b, a) = (255, 99, 71, 255)
  tomato: new Color4(1, 0.3882353, 0.2784314, 1),
  // gray (r, g, b, a) = (128, 128, 128, 255)
  gray: new Color4(0.5019608, 0.5019608, 0.5019608, 1),
  // lightsteelblue (r, g, b, a) = (176, 196, 222, 255)
  lightsteelblue: new Color4(0.6901961, 0.76862746, 0.87058824, 1),
  // darkslategray (r, g, b, a) = (47, 79, 79, 255)
  darkslategray: new Color4(0.18431373, 0.30980393, 0.30980393, 1),
  // lemonchiffon (r, g, b, a) = (255, 250, 205, 255)
  lemonchiffon: new Color4(1, 0.98039216, 0.8039216, 1),
  // orangered (r, g, b, a) = (255, 69, 0, 255)
  orangered: new Color4(1, 0.27058825, 0, 1),
  // darkgray (r, g, b, a) = (169, 169, 169, 255)
  darkgray: new Color4(0.6627451, 0.6627451, 0.6627451, 1),
  // lightslategray (r, g, b, a) = (119, 136, 153, 255)
  lightslategray: new Color4(0.46666667, 0.53333336, 0.6, 1),
  // darkgreen (r, g, b, a) = (0, 100, 0, 255)
  darkgreen: new Color4(0, 0.39215687, 0, 1),
  // wheat (r, g, b, a) = (245, 222, 179, 255)
  wheat: new Color4(0.9607843, 0.87058824, 0.7019608, 1),
  // red (r, g, b, a) = (255, 0, 0, 255)
  red: new Color4(1, 0, 0, 1),
  // silver (r, g, b, a) = (192, 192, 192, 255)
  silver: new Color4(0.7529412, 0.7529412, 0.7529412, 1),
  // slategray (r, g, b, a) = (112, 128, 144, 255)
  slategray: new Color4(0.4392157, 0.5019608, 0.5647059, 1),
  // green (r, g, b, a) = (0, 128, 0, 255)
  green: new Color4(0, 0.5019608, 0, 1),
  // burlywood (r, g, b, a) = (222, 184, 135, 255)
  burlywood: new Color4(0.87058824, 0.72156864, 0.5294118, 1),
  // crimson (r, g, b, a) = (220, 20, 60, 255)
  crimson: new Color4(0.8627451, 0.078431375, 0.23529412, 1),
  // lightgray (r, g, b, a) = (211, 211, 211, 255)
  lightgray: new Color4(0.827451, 0.827451, 0.827451, 1),
  // steelblue (r, g, b, a) = (70, 130, 180, 255)
  steelblue: new Color4(0.27450982, 0.50980395, 0.7058824, 1),
  // forestgreen (r, g, b, a) = (34, 139, 34, 255)
  forestgreen: new Color4(0.13333334, 0.54509807, 0.13333334, 1),
  // tan (r, g, b, a) = (210, 180, 140, 255)
  tan: new Color4(0.8235294, 0.7058824, 0.54901963, 1),
  // mediumvioletred (r, g, b, a) = (199, 21, 133, 255)
  mediumvioletred: new Color4(0.78039217, 0.08235294, 0.52156866, 1),
  // gainsboro (r, g, b, a) = (220, 220, 220, 255)
  gainsboro: new Color4(0.8627451, 0.8627451, 0.8627451, 1),
  // royalblue (r, g, b, a) = (65, 105, 225, 255)
  royalblue: new Color4(0.25490198, 0.4117647, 0.88235295, 1),
  // seagreen (r, g, b, a) = (46, 139, 87, 255)
  seagreen: new Color4(0.18039216, 0.54509807, 0.34117648, 1),
  // khaki (r, g, b, a) = (240, 230, 140, 255)
  khaki: new Color4(0.9411765, 0.9019608, 0.54901963, 1),
  // deeppink (r, g, b, a) = (255, 20, 147, 255)
  deeppink: new Color4(1, 0.078431375, 0.5764706, 1),
  // whitesmoke (r, g, b, a) = (245, 245, 245, 255)
  whitesmoke: new Color4(0.9607843, 0.9607843, 0.9607843, 1),
  // midnightblue (r, g, b, a) = (25, 25, 112, 255)
  midnightblue: new Color4(0.09803922, 0.09803922, 0.4392157, 1),
  // mediumseagreen (r, g, b, a) = (60, 179, 113, 255)
  mediumseagreen: new Color4(0.23529412, 0.7019608, 0.44313726, 1),
  // yellow (r, g, b, a) = (255, 255, 0, 255)
  yellow: new Color4(1, 1, 0, 1),
  // hotpink (r, g, b, a) = (255, 105, 180, 255)
  hotpink: new Color4(1, 0.4117647, 0.7058824, 1),
  // white (r, g, b, a) = (255, 255, 255, 255)
  white: new Color4(1, 1, 1, 1),
  // navy (r, g, b, a) = (0, 0, 128, 255)
  navy: new Color4(0, 0, 0.5019608, 1),
  // mediumaquamarine (r, g, b, a) = (102, 205, 170, 255)
  mediumaquamarine: new Color4(0.4, 0.8039216, 0.6666667, 1),
  // gold (r, g, b, a) = (255, 215, 0, 255)
  gold: new Color4(1, 0.84313726, 0, 1),
  // palevioletred (r, g, b, a) = (219, 112, 147, 255)
  palevioletred: new Color4(0.85882354, 0.4392157, 0.5764706, 1),
  // snow (r, g, b, a) = (255, 250, 250, 255)
  snow: new Color4(1, 0.98039216, 0.98039216, 1),
  // darkblue (r, g, b, a) = (0, 0, 139, 255)
  darkblue: new Color4(0, 0, 0.54509807, 1),
  // darkseagreen (r, g, b, a) = (143, 188, 143, 255)
  darkseagreen: new Color4(0.56078434, 0.7372549, 0.56078434, 1),
  // orange (r, g, b, a) = (255, 165, 0, 255)
  orange: new Color4(1, 0.64705884, 0, 1),
  // pink (r, g, b, a) = (255, 192, 203, 255)
  pink: new Color4(1, 0.7529412, 0.79607844, 1),
  // ghostwhite (r, g, b, a) = (248, 248, 255, 255)
  ghostwhite: new Color4(0.972549, 0.972549, 1, 1),
  // mediumblue (r, g, b, a) = (0, 0, 205, 255)
  mediumblue: new Color4(0, 0, 0.8039216, 1),
  // aquamarine (r, g, b, a) = (127, 255, 212, 255)
  aquamarine: new Color4(0.49803922, 1, 0.83137256, 1),
  // sandybrown (r, g, b, a) = (244, 164, 96, 255)
  sandybrown: new Color4(0.95686275, 0.6431373, 0.3764706, 1),
  // lightpink (r, g, b, a) = (255, 182, 193, 255)
  lightpink: new Color4(1, 0.7137255, 0.75686276, 1),
  // floralwhite (r, g, b, a) = (255, 250, 240, 255)
  floralwhite: new Color4(1, 0.98039216, 0.9411765, 1),
  // blue (r, g, b, a) = (0, 0, 255, 255)
  blue: new Color4(0, 0, 1, 1),
  // palegreen (r, g, b, a) = (152, 251, 152, 255)
  palegreen: new Color4(0.59607846, 0.9843137, 0.59607846, 1),
  // darkorange (r, g, b, a) = (255, 140, 0, 255)
  darkorange: new Color4(1, 0.54901963, 0, 1),
  // thistle (r, g, b, a) = (216, 191, 216, 255)
  thistle: new Color4(0.84705883, 0.7490196, 0.84705883, 1),
  // linen (r, g, b, a) = (250, 240, 230, 255)
  linen: new Color4(0.98039216, 0.9411765, 0.9019608, 1),
  // dodgerblue (r, g, b, a) = (30, 144, 255, 255)
  dodgerblue: new Color4(0.11764706, 0.5647059, 1, 1),
  // lightgreen (r, g, b, a) = (144, 238, 144, 255)
  lightgreen: new Color4(0.5647059, 0.93333334, 0.5647059, 1),
  // goldenrod (r, g, b, a) = (218, 165, 32, 255)
  goldenrod: new Color4(0.85490197, 0.64705884, 0.1254902, 1),
  // magenta (r, g, b, a) = (255, 0, 255, 255)
  magenta: new Color4(1, 0, 1, 1),
  // antiquewhite (r, g, b, a) = (250, 235, 215, 255)
  antiquewhite: new Color4(0.98039216, 0.92156863, 0.84313726, 1),
  // cornflowerblue (r, g, b, a) = (100, 149, 237, 255)
  cornflowerblue: new Color4(0.39215687, 0.58431375, 0.92941177, 1),
  // springgreen (r, g, b, a) = (0, 255, 127, 255)
  springgreen: new Color4(0, 1, 0.49803922, 1),
  // peru (r, g, b, a) = (205, 133, 63, 255)
  peru: new Color4(0.8039216, 0.52156866, 0.24705882, 1),
  // fuchsia (r, g, b, a) = (255, 0, 255, 255)
  fuchsia: new Color4(1, 0, 1, 1),
  // papayawhip (r, g, b, a) = (255, 239, 213, 255)
  papayawhip: new Color4(1, 0.9372549, 0.8352941, 1),
  // deepskyblue (r, g, b, a) = (0, 191, 255, 255)
  deepskyblue: new Color4(0, 0.7490196, 1, 1),
  // mediumspringgreen (r, g, b, a) = (0, 250, 154, 255)
  mediumspringgreen: new Color4(0, 0.98039216, 0.6039216, 1),
  // darkgoldenrod (r, g, b, a) = (184, 134, 11, 255)
  darkgoldenrod: new Color4(0.72156864, 0.5254902, 0.043137256, 1),
  // violet (r, g, b, a) = (238, 130, 238, 255)
  violet: new Color4(0.93333334, 0.50980395, 0.93333334, 1),
  // blanchedalmond (r, g, b, a) = (255, 235, 205, 255)
  blanchedalmond: new Color4(1, 0.92156863, 0.8039216, 1),
  // lightskyblue (r, g, b, a) = (135, 206, 250, 255)
  lightskyblue: new Color4(0.5294118, 0.80784315, 0.98039216, 1),
  // lawngreen (r, g, b, a) = (124, 252, 0, 255)
  lawngreen: new Color4(0.4862745, 0.9882353, 0, 1),
  // chocolate (r, g, b, a) = (210, 105, 30, 255)
  chocolate: new Color4(0.8235294, 0.4117647, 0.11764706, 1),
  // plum (r, g, b, a) = (221, 160, 221, 255)
  plum: new Color4(0.8666667, 0.627451, 0.8666667, 1),
  // bisque (r, g, b, a) = (255, 228, 196, 255)
  bisque: new Color4(1, 0.89411765, 0.76862746, 1),
  // skyblue (r, g, b, a) = (135, 206, 235, 255)
  skyblue: new Color4(0.5294118, 0.80784315, 0.92156863, 1),
  // chartreuse (r, g, b, a) = (127, 255, 0, 255)
  chartreuse: new Color4(0.49803922, 1, 0, 1),
  // sienna (r, g, b, a) = (160, 82, 45, 255)
  sienna: new Color4(0.627451, 0.32156864, 0.1764706, 1),
  // orchid (r, g, b, a) = (218, 112, 214, 255)
  orchid: new Color4(0.85490197, 0.4392157, 0.8392157, 1),
  // moccasin (r, g, b, a) = (255, 228, 181, 255)
  moccasin: new Color4(1, 0.89411765, 0.70980394, 1),
  // lightblue (r, g, b, a) = (173, 216, 230, 255)
  lightblue: new Color4(0.6784314, 0.84705883, 0.9019608, 1),
  // greenyellow (r, g, b, a) = (173, 255, 47, 255)
  greenyellow: new Color4(0.6784314, 1, 0.18431373, 1),
  // saddlebrown (r, g, b, a) = (139, 69, 19, 255)
  saddlebrown: new Color4(0.54509807, 0.27058825, 0.07450981, 1),
  // mediumorchid (r, g, b, a) = (186, 85, 211, 255)
  mediumorchid: new Color4(0.7294118, 0.33333334, 0.827451, 1),
  // navajowhite (r, g, b, a) = (255, 222, 173, 255)
  navajowhite: new Color4(1, 0.87058824, 0.6784314, 1),
  // powderblue (r, g, b, a) = (176, 224, 230, 255)
  powderblue: new Color4(0.6901961, 0.8784314, 0.9019608, 1),
  // lime (r, g, b, a) = (0, 255, 0, 255)
  lime: new Color4(0, 1, 0, 1),
  // maroon (r, g, b, a) = (128, 0, 0, 255)
  maroon: new Color4(0.5019608, 0, 0, 1),
  // darkorchid (r, g, b, a) = (153, 50, 204, 255)
  darkorchid: new Color4(0.6, 0.19607843, 0.8, 1),
  // peachpuff (r, g, b, a) = (255, 218, 185, 255)
  peachpuff: new Color4(1, 0.85490197, 0.7254902, 1),
  // paleturquoise (r, g, b, a) = (175, 238, 238, 255)
  paleturquoise: new Color4(0.6862745, 0.93333334, 0.93333334, 1),
  // limegreen (r, g, b, a) = (50, 205, 50, 255)
  limegreen: new Color4(0.19607843, 0.8039216, 0.19607843, 1),
  // darkred (r, g, b, a) = (139, 0, 0, 255)
  darkred: new Color4(0.54509807, 0, 0, 1),
  // darkviolet (r, g, b, a) = (148, 0, 211, 255)
  darkviolet: new Color4(0.5803922, 0, 0.827451, 1),
  // mistyrose (r, g, b, a) = (255, 228, 225, 255)
  mistyrose: new Color4(1, 0.89411765, 0.88235295, 1),
  // lightcyan (r, g, b, a) = (224, 255, 255, 255)
  lightcyan: new Color4(0.8784314, 1, 1, 1),
  // yellowgreen (r, g, b, a) = (154, 205, 50, 255)
  yellowgreen: new Color4(0.6039216, 0.8039216, 0.19607843, 1),
  // brown (r, g, b, a) = (165, 42, 42, 255)
  brown: new Color4(0.64705884, 0.16470589, 0.16470589, 1),
  // darkmagenta (r, g, b, a) = (139, 0, 139, 255)
  darkmagenta: new Color4(0.54509807, 0, 0.54509807, 1),
  // lavenderblush (r, g, b, a) = (255, 240, 245, 255)
  lavenderblush: new Color4(1, 0.9411765, 0.9607843, 1),
  // cyan (r, g, b, a) = (0, 255, 255, 255)
  cyan: new Color4(0, 1, 1, 1),
  // darkolivegreen (r, g, b, a) = (85, 107, 47, 255)
  darkolivegreen: new Color4(0.33333334, 0.41960785, 0.18431373, 1),
  // firebrick (r, g, b, a) = (178, 34, 34, 255)
  firebrick: new Color4(0.69803923, 0.13333334, 0.13333334, 1),
  // purple (r, g, b, a) = (128, 0, 128, 255)
  purple: new Color4(0.5019608, 0, 0.5019608, 1),
  // seashell (r, g, b, a) = (255, 245, 238, 255)
  seashell: new Color4(1, 0.9607843, 0.93333334, 1),
  // aqua (r, g, b, a) = (0, 255, 255, 255)
  aqua: new Color4(0, 1, 1, 1),
  // olivedrab (r, g, b, a) = (107, 142, 35, 255)
  olivedrab: new Color4(0.41960785, 0.5568628, 0.13725491, 1),
  // indianred (r, g, b, a) = (205, 92, 92, 255)
  indianred: new Color4(0.8039216, 0.36078432, 0.36078432, 1),
  // indigo (r, g, b, a) = (75, 0, 130, 255)
  indigo: new Color4(0.29411766, 0, 0.50980395, 1),
  // oldlace (r, g, b, a) = (253, 245, 230, 255)
  oldlace: new Color4(0.99215686, 0.9607843, 0.9019608, 1),
  // turquoise (r, g, b, a) = (64, 224, 208, 255)
  turquoise: new Color4(0.2509804, 0.8784314, 0.8156863, 1),
  // olive (r, g, b, a) = (128, 128, 0, 255)
  olive: new Color4(0.5019608, 0.5019608, 0, 1),
  // rosybrown (r, g, b, a) = (188, 143, 143, 255)
  rosybrown: new Color4(0.7372549, 0.56078434, 0.56078434, 1),
  // darkslateblue (r, g, b, a) = (72, 61, 139, 255)
  darkslateblue: new Color4(0.28235295, 0.23921569, 0.54509807, 1),
  // ivory (r, g, b, a) = (255, 255, 240, 255)
  ivory: new Color4(1, 1, 0.9411765, 1),
  // mediumturquoise (r, g, b, a) = (72, 209, 204, 255)
  mediumturquoise: new Color4(0.28235295, 0.81960785, 0.8, 1),
  // darkkhaki (r, g, b, a) = (189, 183, 107, 255)
  darkkhaki: new Color4(0.7411765, 0.7176471, 0.41960785, 1),
  // darksalmon (r, g, b, a) = (233, 150, 122, 255)
  darksalmon: new Color4(0.9137255, 0.5882353, 0.47843137, 1),
  // blueviolet (r, g, b, a) = (138, 43, 226, 255)
  blueviolet: new Color4(0.5411765, 0.16862746, 0.8862745, 1),
  // honeydew (r, g, b, a) = (240, 255, 240, 255)
  honeydew: new Color4(0.9411765, 1, 0.9411765, 1),
  // darkturquoise (r, g, b, a) = (0, 206, 209, 255)
  darkturquoise: new Color4(0, 0.80784315, 0.81960785, 1),
  // palegoldenrod (r, g, b, a) = (238, 232, 170, 255)
  palegoldenrod: new Color4(0.93333334, 0.9098039, 0.6666667, 1),
  // lightcoral (r, g, b, a) = (240, 128, 128, 255)
  lightcoral: new Color4(0.9411765, 0.5019608, 0.5019608, 1),
  // mediumpurple (r, g, b, a) = (147, 112, 219, 255)
  mediumpurple: new Color4(0.5764706, 0.4392157, 0.85882354, 1),
  // mintcream (r, g, b, a) = (245, 255, 250, 255)
  mintcream: new Color4(0.9607843, 1, 0.98039216, 1),
  // lightseagreen (r, g, b, a) = (32, 178, 170, 255)
  lightseagreen: new Color4(0.1254902, 0.69803923, 0.6666667, 1),
  // cornsilk (r, g, b, a) = (255, 248, 220, 255)
  cornsilk: new Color4(1, 0.972549, 0.8627451, 1),
  // salmon (r, g, b, a) = (250, 128, 114, 255)
  salmon: new Color4(0.98039216, 0.5019608, 0.44705883, 1),
  // slateblue (r, g, b, a) = (106, 90, 205, 255)
  slateblue: new Color4(0.41568628, 0.3529412, 0.8039216, 1),
  // azure (r, g, b, a) = (240, 255, 255, 255)
  azure: new Color4(0.9411765, 1, 1, 1),
  // cadetblue (r, g, b, a) = (95, 158, 160, 255)
  cadetblue: new Color4(0.37254903, 0.61960787, 0.627451, 1),
  // beige (r, g, b, a) = (245, 245, 220, 255)
  beige: new Color4(0.9607843, 0.9607843, 0.8627451, 1),
  // lightsalmon (r, g, b, a) = (255, 160, 122, 255)
  lightsalmon: new Color4(1, 0.627451, 0.47843137, 1),
  // mediumslateblue (r, g, b, a) = (123, 104, 238, 255)
  mediumslateblue: new Color4(0.48235294, 0.40784314, 0.93333334, 1),
} as const
