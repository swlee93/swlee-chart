export declare const setCanvasDPI: (canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D | undefined) => CanvasRenderingContext2D;
export declare const inMouse: (positions: Array<Array<number>>, evt: MouseEvent) => boolean;
export declare const inMouseOnRect: (rect: [number, number, number, number] | undefined, evt: MouseEvent) => boolean;
export declare const hex2rgba: (hex?: string, alpha?: number) => string;
