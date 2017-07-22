import {assert} from 'chai';
import wooordhunt from '../lib';

describe('wooordhunt', function () {
    it('should return examples', function () {
        return wooordhunt('cat', ['examples'])
            .then(result => {
                assert.hasAllKeys(result, ['word', 'examples']);
                assert.equal(result.word, 'cat');
                assert.isNotEmpty(result.examples);
            });
    });

    it('should return phrases', function () {
        return wooordhunt('cat', ['phrases'])
            .then(result => {
                assert.hasAllKeys(result, ['word', 'phrases']);
                assert.equal(result.word, 'cat');
                assert.isNotEmpty(result.phrases);
            });
    });

    it('should return examples & phrases', function () {
        return wooordhunt('cat', ['examples', 'phrases'])
            .then(result => {
                assert.hasAllKeys(result, ['word', 'examples', 'phrases']);
                assert.equal(result.word, 'cat');
                assert.isNotEmpty(result.examples);
                assert.isNotEmpty(result.phrases);
            });
    });

    it('should return all', function () {
        return wooordhunt('cat')
            .then(result => {
                assert.hasAllKeys(result, ['word', 'examples', 'phrases']);
                assert.equal(result.word, 'cat');
                assert.isNotEmpty(result.examples);
                assert.isNotEmpty(result.phrases);
            });
    });
});