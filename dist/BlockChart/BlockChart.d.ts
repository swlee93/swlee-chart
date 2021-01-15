import { ThemeAttrs } from '../theme';
/**
 * inactive => 죽은 상태, 회색
 * unknown => 알 수 없음, 빈칸
 * error => 빨강
 * warning => 주황
 * normal => 파랑 (기본)
 * undefined is normal 무소식 is 희소식
 */
export declare type Status = 'inactive' | 'unknown' | 'error' | 'warning' | 'normal' | undefined;
export interface ColorMeta {
    inactive?: string;
    error?: string;
    warning?: string;
    normal?: string;
    unknown?: string;
}
interface Data {
    value: number;
    label: string;
    id: string;
    [key: string]: any;
}
declare type Datas = Array<Data>;
/**
 * 육각형 객체 하나
 */
declare class Block {
    private parent;
    private value;
    status: Status;
    pos: [number, number, number, number];
    data: Data;
    lastData?: Data;
    private inactiveOut;
    prevStatus?: Status;
    constructor(parent: BlockChart, data: Data, x: number, y: number, w: number, h: number);
    updateData: (data: Data) => void;
    resizeBlock: (x: number, y: number, w: number, h: number) => void;
    private fittingString;
    render: () => void;
}
/**
 * 전체 육각형
 */
interface Option {
    fixedMaxValue?: number;
    mouseHoverCallback?: Function;
}
declare class BlockChart {
    private canvas;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    themeAttrs: ThemeAttrs;
    colorMeta?: ColorMeta;
    x: number;
    y: number;
    hovering?: Block;
    dataIds: Array<string>;
    blocks: {
        [key: string]: Block;
    };
    private datas;
    maxValue: number;
    private fixedMaxValue;
    private jsonDatas;
    private prevDataIds;
    hasSort?: boolean;
    thresholds?: (value: number, rowData: any) => Status;
    valueVisible?: boolean;
    valueFormat?: Function;
    onClick?: Function;
    private tooltip;
    format?: Function;
    private mouseHoverCallback?;
    constructor(canvas: HTMLCanvasElement, option: Option);
    draw: () => void;
    loadData: (datas: Datas, clear?: boolean) => void;
    private makeBlock;
    private cols;
    private rows;
    private w;
    private h;
    private setBlockBase;
    private setAttribute;
    getStatusColor: (status?: Status, alpha?: number) => string;
    /**
     * Events
     */
    resizeEvent: () => void;
    private mouseClickEvent;
    private mouseHoverThrottlingTimmer;
    private mouseHoverDebounceEvent?;
    private mouseHoverEvent;
    private mouseHoverEventFunc;
    private mouseLeaveEvent;
}
export default BlockChart;
