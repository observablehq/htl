import { html } from '../src/index';
describe('interpolation', () => {
  it('interpolating text between <textarea> is unescaped', () => {
    expect(html`<textarea>${'X'}</textarea>`.outerHTML).toBe('<textarea>X</textarea>');
  });

  it('interpolatings text between <span> is unescaped', () => {
      expect(html`<span>${'X'}</span>`.outerHTML).toBe('<span>X</span>');
  });
});
