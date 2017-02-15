import { App0116Page } from './app.po';

describe('app0116 App', function() {
  let page: App0116Page;

  beforeEach(() => {
    page = new App0116Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
