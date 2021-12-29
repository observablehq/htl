declare module 'htl' {
    /** Renders the specified markup as an element, text node, or null as appropriate. */
    const html: {
        <T extends HTMLElement | Text | null>(...args: any[]): T;
        /** Renders the specified markup as a document fragment. */
        fragment(...args: any[]): DocumentFragment;
    };
    /** Renders the specified markup as an SVG element, text node, or null as appropriate. */
    const svg: {
        <T extends SVGElement | Text | null>(...args: any[]): T;
        /** Renders the specified markup as a document fragment. */
        fragment(...args: any[]): DocumentFragment;
    };
    export { html, svg };
}
