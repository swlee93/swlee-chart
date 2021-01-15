export default class Tooltip {
    private tooltipEl;
    tooltipStat: Boolean;
    constructor();
    private setDefaultStyle;
    tooltipOn: () => void;
    tooltipOff: () => void;
    follow: (evt: MouseEvent) => void;
    changeText: (dom: HTMLElement) => void;
}
export declare const getNomalText: (text: string) => HTMLElement;
export declare const getNomalGrayText: (text: string) => HTMLElement;
export declare const getTitleText: (text: string) => HTMLElement;
export declare const getSubTitleText: (text: string) => HTMLElement;
export declare const getStrongText: (text: string) => HTMLElement;
export declare const getTitleValueText: (title: string, value: string, valueColor?: string | undefined) => HTMLElement;
export declare const getLabelValueText: (label: string, value: string, color: string) => HTMLDivElement;
