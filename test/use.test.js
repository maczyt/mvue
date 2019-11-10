import MVue from "../src";

describe('MVue.use test', () => {
    it('plugin.install should get MVue', () => {
        MVue.use({
            install(M) {
                expect(M).toEqual(MVue);
            }
        })
    });
});