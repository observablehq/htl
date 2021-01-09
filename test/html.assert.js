import { html } from '../src/index';
describe('Interpolation', () => {
    // https://www.w3.org/TR/html52/syntax.html#writing-html-documents-elements

    it('within normal elements', () => {
        expect(html`<span>${'X'}</span>`.outerHTML).toBe('<span>X</span>');
    });

    it('within raw text elements', () => {
        // https://www.w3.org/TR/html52/syntax.html#raw-text
        // <script> and <style> are special cases
        expect(html`<script>${'X'}</script>`.outerHTML).toBe('<script>X</script>');
        expect(html`<style>${'X'}</style>`.outerHTML).toBe('<style>X</style>');
    });

    it('within escapable raw text elements', () => {
        // https://www.w3.org/TR/html52/syntax.html#escapable-raw-text
        // <title> and <textarea> are special cases
        expect(html`<textarea>${'X'}</textarea>`.outerHTML).toBe('<textarea>X</textarea>');
        expect(html`<title>${'X'}</title>`.outerHTML).toBe('<title>X</title>');
    });
});