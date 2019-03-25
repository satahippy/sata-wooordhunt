import {assert} from 'chai';
import wooordhunt from '../lib';

describe('wooordhunt', function () {
    it('should return examples', function () {
        return wooordhunt('cat', ['examples'])
            .then(result => {
                assert.hasAllKeys(result, ['word', 'examples']);
                assert.equal(result.word, 'cat');
                assert.isNotEmpty(result.examples);
                assert.notInclude(result.examples[0].translation, '☰');
            });
    });

    it('should return examples for composite word', function () {
        return wooordhunt('by far', ['examples'])
            .then(result => {
                assert.isNotEmpty(result.examples);
                assert.equal(result.examples[0].original, 'John\'s idea is by far the best option.');
                assert.equal(result.examples[0].translation, 'План Джона — однозначно лучший вариант.');
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

    it('should return translations', function () {
        return wooordhunt('cat', ['translations'])
            .then(result => {
                assert.hasAllKeys(result, ['word', 'translations']);
                assert.equal(result.word, 'cat');
                assert.isNotEmpty(result.translations);
            });
    });

    it('should return hidden translations', function () {
        return wooordhunt('run', ['translations'])
            .then(result => {
                assert.hasAllKeys(result, ['word', 'translations']);
                assert.equal(result.word, 'run');
                assert.isAbove(result.translations.length, 100);
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

    it('should return empty object if word is not found', function () {
        return wooordhunt('asdasd')
            .then(result => {
                assert.hasAllKeys(result, ['word', 'examples', 'phrases']);
                assert.equal(result.word, 'asdasd');
                assert.isEmpty(result.examples);
                assert.isEmpty(result.phrases);
            });
    });
});
