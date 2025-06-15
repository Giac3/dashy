import {Layout as ReactGridLayout} from "@incmix/react-grid-layout";
import { TWidgetWithMetadata } from "./widget";


export type TGridLayout = ReactGridLayout & {
  widget: TWidgetWithMetadata;
}

export type TGridLayouts = TGridLayout[];