import { PhanAnhKienNghiTemplatePage } from './app.po';

describe('PhanAnhKienNghi App', function() {
  let page: PhanAnhKienNghiTemplatePage;

  beforeEach(() => {
    page = new PhanAnhKienNghiTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
