// @flow

import fetch from 'isomorphic-fetch';
import cheerio from 'cheerio';

type FeatureType = "examples" | "phrases";

type Example = {
    original: string,
    translation: string
};

type Phrase = {
    original: string,
    translation: string
};

type Translation = {
    translation: string
};

type Result = {
    word: string,
    examples?: Array<Example>,
    phrases?: Array<Phrase>
};

const examples = ($): Array<Example> => {
    const examples: Array<Example> = [];
    $('.ex_o').each(function () {
        const original = $(this);
        const translation = $(this).next();
        if (!translation.hasClass('ex_t')) {
            return;
        }
        examples.push({
            original: original.text().trim(),
            translation: onlyNodeText(translation).trim()
        })
    });
    return examples;
};

const phrases = ($) => {
    const phrases: Array<Phrase> = [];
    ($('.phrases').html() || '')
        .split('<br>')
        .forEach(item => {
            const [original, translation] = $('<div/>').html(item).text().split('—', 2);
            if (!original || !translation) {
                return;
            }
            phrases.push({
                original: original.trim(),
                translation: translation.trim()
            })
        });
    return phrases;
};

const translations = ($) => {
    const translations: Array<Translation> = [];

    const translationsExtractorFromTrDiv = ($tr) => {
        $tr.clone().children('div').remove().end().html().split('<br>').forEach(item => {
            const text = $('<div/>').html(item).text().trim();

            if (!text.startsWith('-')) {
                return;
            }

            translations.push({
                translation: text.substring(2)
            });
        });
    };

    $('.tr').each(function () {
        translationsExtractorFromTrDiv($(this));
    });
    $('.tr div[class="hidden"]').each(function () {
        translationsExtractorFromTrDiv($(this));
    });

    return translations;
};

const featuresMap = {
    examples,
    phrases,
    translations
};

const onlyNodeText = (node) =>
    node.clone().children().remove().end().text();

const request = (word: string, features: Array<FeatureType> = ['examples', 'phrases']): Promise<Result> => {
    return fetch(`http://wooordhunt.ru/word/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Wooordhunt has responded with ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const $ = cheerio.load(html);
            return features.reduce((result: Object, feature) => {
                if (!featuresMap[feature]) {
                    throw new Error(`Feature ${feature} is not supported`)
                }
                result[feature] = featuresMap[feature]($);
                return result;
            }, {
                word
            });
        });
};

export default request;
