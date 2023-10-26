/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

import { loadFontsForText } from './LoadFontForLanguage';
import '@testing-library/jest-dom';

describe('loadFontsForText', function () {
	it('should load lanagauge', function () {
		expect(loadFontsForText('omkar')).toStrictEqual([]);
	});
	it('should load marathi', function () {
		expect(
			loadFontsForText(
				'किसी व्यक्ति की एकान्तता, परिवार, घर या पत्रव्यवहार के प्रति कोई मनमाना हस्तक्षेप न किया जाएगा, न किसी के सम्मान और ख्याति पर कोई आक्षेप हो सकेगा । ऐसे हस्तक्षेप या आधेपों के विरुद्ध प्रत्येक को क़ानूनी रक्षा का अधिकार प्राप्त है । प्रत्येक व्यक्ति को विचार, अन्तरात्मा और'
			)
		).toStrictEqual(['Noto Sans Devanagari']);
	});
});
