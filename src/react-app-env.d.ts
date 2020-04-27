/// <reference types="react-scripts" />
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    borderRadius: string;
    colors: {
      $color1: string;
      $color2: string;
      $color3: string;
      $color4: string;
      $color5: string;
    };
  }
}

declare module "d3-dag";
declare module "cytoscape-cose-bilkent";
declare module "react-search";
