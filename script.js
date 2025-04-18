function md5(str) {
    function rotateLeft(value, amount) {
        var lbits = (value << amount) | (value >>> (32 - amount));
        return lbits << 0;
    }

    function addUnsigned(x, y) {
        var x4, y4, x8, y8, result;
        x8 = (x & 0x80000000);
        y8 = (y & 0x80000000);
        x4 = (x & 0x40000000);
        y4 = (y & 0x40000000);
        result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
        if (x4 & y4) {
            return (result ^ 0x80000000 ^ x8 ^ y8);
        }
        if (x4 | y4) {
            if (result & 0x40000000) {
                return (result ^ 0xC0000000 ^ x8 ^ y8);
            } else {
                return (result ^ 0x40000000 ^ x8 ^ y8);
            }
        } else {
            return (result ^ x8 ^ y8);
        }
    }

    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }

    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function wordToHex(lValue) {
        var wordToHexValue = "", wordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    }

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    str = str.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < str.length; n++) {
        var c = str.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }

    x = convertToWordArray(utftext);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
}

function sha1(str) {
    function rotateLeft(n, s) {
        return (n << s) | (n >>> (32 - s));
    }

    function lsbHex(val) {
        var str = '';
        var i;
        var vh;
        var vl;
        
        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    }

    function cvtHex(val) {
        var str = '';
        var i;
        var v;
        
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    }

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    str = str.replace(/\r\n/g, "\n");
    var utf8 = '';
    for (var n = 0; n < str.length; n++) {
        var c = str.charCodeAt(n);
        if (c < 128) {
            utf8 += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utf8 += String.fromCharCode((c >> 6) | 192);
            utf8 += String.fromCharCode((c & 63) | 128);
        } else {
            utf8 += String.fromCharCode((c >> 12) | 224);
            utf8 += String.fromCharCode(((c >> 6) & 63) | 128);
            utf8 += String.fromCharCode((c & 63) | 128);
        }
    }

    str = utf8;
    var str_len = str.length;
    var word_array = [];
    for (i = 0; i < str_len - 3; i += 4) {
        j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (str_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) word_array.push(0);

    word_array.push(str_len >>> 29);
    word_array.push((str_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotateLeft(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotateLeft(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotateLeft(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotateLeft(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }

    temp = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4);
    return temp.toLowerCase();
}

function sha256(str) {
    function rotr(n, x) {
        return (x >>> n) | (x << (32 - n));
    }

    function choice(x, y, z) {
        return (x & y) ^ (~x & z);
    }

    function majority(x, y, z) {
        return (x & y) ^ (x & z) ^ (y & z);
    }

    function sha256_Sigma0(x) {
        return rotr(2, x) ^ rotr(13, x) ^ rotr(22, x);
    }

    function sha256_Sigma1(x) {
        return rotr(6, x) ^ rotr(11, x) ^ rotr(25, x);
    }

    function sha256_sigma0(x) {
        return rotr(7, x) ^ rotr(18, x) ^ (x >>> 3);
    }

    function sha256_sigma1(x) {
        return rotr(17, x) ^ rotr(19, x) ^ (x >>> 10);
    }

    function sha256_expand(W, j) {
        return W[j & 0x0f] += sha256_sigma1(W[(j + 14) & 0x0f]) + W[(j + 9) & 0x0f] + sha256_sigma0(W[(j + 1) & 0x0f]);
    }

    var K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

    str = str.replace(/\r\n/g, "\n");
    var utf8 = '';
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8 += String.fromCharCode(charcode);
        else if (charcode < 0x800) {
            utf8 += String.fromCharCode(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8 += String.fromCharCode(0xe0 | (charcode >> 12), 0x80 | ((charcode>>6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
        else {
            i++;
            charcode = 0x10000 + (((charcode & 0x3ff)<<10) | (str.charCodeAt(i) & 0x3ff));
            utf8 += String.fromCharCode(0xf0 | (charcode >>18), 0x80 | ((charcode>>12) & 0x3f), 0x80 | ((charcode>>6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
    }

    str = utf8;
    var length = str.length;
    var chunks = [];

    str += String.fromCharCode(0x80);
    var l = str.length / 4 + 2;
    var N = Math.ceil(l / 16);
    var M = new Array(N);

    for (var i = 0; i < N; i++) {
        M[i] = new Array(16);
        for (var j = 0; j < 16; j++) {
            M[i][j] = str.charCodeAt(i * 64 + j * 4) << 24 | str.charCodeAt(i * 64 + j * 4 + 1) << 16 | str.charCodeAt(i * 64 + j * 4 + 2) << 8 | str.charCodeAt(i * 64 + j * 4 + 3);
        }
    }

    M[N - 1][14] = ((length - 1) * 8) / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = ((length - 1) * 8) & 0xffffffff;

    for (var i = 0; i < N; i++) {
        var W = new Array(64);

        for (var t = 0; t < 16; t++) W[t] = M[i][t];
        for (var t = 16; t < 64; t++) W[t] = (sha256_sigma1(W[t - 2]) + W[t - 7] + sha256_sigma0(W[t - 15]) + W[t - 16]) & 0xffffffff;

        var a = H[0]; var b = H[1]; var c = H[2]; var d = H[3]; var e = H[4]; var f = H[5]; var g = H[6]; var h = H[7];

        for (var t = 0; t < 64; t++) {
            var T1 = h + sha256_Sigma1(e) + choice(e, f, g) + K[t] + W[t];
            var T2 = sha256_Sigma0(a) + majority(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + T1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) & 0xffffffff;
        }

        H[0] = (H[0] + a) & 0xffffffff;
        H[1] = (H[1] + b) & 0xffffffff;
        H[2] = (H[2] + c) & 0xffffffff;
        H[3] = (H[3] + d) & 0xffffffff;
        H[4] = (H[4] + e) & 0xffffffff;
        H[5] = (H[5] + f) & 0xffffffff;
        H[6] = (H[6] + g) & 0xffffffff;
        H[7] = (H[7] + h) & 0xffffffff;
    }

    return H.map(function(h) { return ("00000000" + h.toString(16)).slice(-8); }).join('');
}

function sha512(str) {
    function int64(msint32, lsint32) {
        return {h: msint32, l: lsint32};
    }

    function int64copy(dst, src) {
        dst.h = src.h;
        dst.l = src.l;
    }

    function int64rrot(dst, x, n) {
        dst.l = (x.l >>> n | x.h << (32 - n)) >>> 0;
        dst.h = (x.h >>> n | x.l << (32 - n)) >>> 0;
    }

    function int64revrrot(dst, x, n) {
        dst.l = (x.h >>> n | x.l << (32 - n)) >>> 0;
        dst.h = (x.l >>> n | x.h << (32 - n)) >>> 0;
    }

    function int64shr(dst, x, n) {
        dst.l = (x.l >>> n | x.h << (32 - n)) >>> 0;
        dst.h = x.h >>> n;
    }

    function int64add(dst, x, y) {
        var w0 = (x.l & 0xffff) + (y.l & 0xffff);
        var w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16);
        var w2 = (x.h & 0xffff) + (y.h & 0xffff) + (w1 >>> 16);
        var w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
        dst.l = (w0 & 0xffff) | (w1 << 16);
        dst.h = (w2 & 0xffff) | (w3 << 16);
    }

    function int64add4(dst, a, b, c, d) {
        var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff);
        var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16);
        var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (w1 >>> 16);
        var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
        dst.l = (w0 & 0xffff) | (w1 << 16);
        dst.h = (w2 & 0xffff) | (w3 << 16);
    }

    function int64add5(dst, a, b, c, d, e) {
        var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff) + (e.l & 0xffff);
        var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (w0 >>> 16);
        var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (e.h & 0xffff) + (w1 >>> 16);
        var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (w2 >>> 16);
        dst.l = (w0 & 0xffff) | (w1 << 16);
        dst.h = (w2 & 0xffff) | (w3 << 16);
    }

    var H = [
        int64(0x6a09e667, 0xf3bcc908), int64(0xbb67ae85, 0x84caa73b),
        int64(0x3c6ef372, 0xfe94f82b), int64(0xa54ff53a, 0x5f1d36f1),
        int64(0x510e527f, 0xade682d1), int64(0x9b05688c, 0x2b3e6c1f),
        int64(0x1f83d9ab, 0xfb41bd6b), int64(0x5be0cd19, 0x137e2179)
    ];

    var K = [
        int64(0x428a2f98, 0xd728ae22), int64(0x71374491, 0x23ef65cd),
        int64(0xb5c0fbcf, 0xec4d3b2f), int64(0xe9b5dba5, 0x8189dbbc),
        int64(0x3956c25b, 0xf348b538), int64(0x59f111f1, 0xb605d019),
        int64(0x923f82a4, 0xaf194f9b), int64(0xab1c5ed5, 0xda6d8118),
        int64(0xd807aa98, 0xa3030242), int64(0x12835b01, 0x45706fbe),
        int64(0x243185be, 0x4ee4b28c), int64(0x550c7dc3, 0xd5ffb4e2),
        int64(0x72be5d74, 0xf27b896f), int64(0x80deb1fe, 0x3b1696b1),
        int64(0x9bdc06a7, 0x25c71235), int64(0xc19bf174, 0xcf692694),
        int64(0xe49b69c1, 0x9ef14ad2), int64(0xefbe4786, 0x384f25e3),
        int64(0x0fc19dc6, 0x8b8cd5b5), int64(0x240ca1cc, 0x77ac9c65),
        int64(0x2de92c6f, 0x592b0275), int64(0x4a7484aa, 0x6ea6e483),
        int64(0x5cb0a9dc, 0xbd41fbd4), int64(0x76f988da, 0x831153b5),
        int64(0x983e5152, 0xee66dfab), int64(0xa831c66d, 0x2db43210),
        int64(0xb00327c8, 0x98fb213f), int64(0xbf597fc7, 0xbeef0ee4),
        int64(0xc6e00bf3, 0x3da88fc2), int64(0xd5a79147, 0x930aa725),
        int64(0x06ca6351, 0xe003826f), int64(0x14292967, 0x0a0e6e70),
        int64(0x27b70a85, 0x46d22ffc), int64(0x2e1b2138, 0x5c26c926),
        int64(0x4d2c6dfc, 0x5ac42aed), int64(0x53380d13, 0x9d95b3df),
        int64(0x650a7354, 0x8baf63de), int64(0x766a0abb, 0x3c77b2a8),
        int64(0x81c2c92e, 0x47edaee6), int64(0x92722c85, 0x1482353b),
        int64(0xa2bfe8a1, 0x4cf10364), int64(0xa81a664b, 0xbc423001),
        int64(0xc24b8b70, 0xd0f89791), int64(0xc76c51a3, 0x0654be30),
        int64(0xd192e819, 0xd6ef5218), int64(0xd6990624, 0x5565a910),
        int64(0xf40e3585, 0x5771202a), int64(0x106aa070, 0x32bbd1b8),
        int64(0x19a4c116, 0xb8d2d0c8), int64(0x1e376c08, 0x5141ab53),
        int64(0x2748774c, 0xdf8eeb99), int64(0x34b0bcb5, 0xe19b48a8),
        int64(0x391c0cb3, 0xc5c95a63), int64(0x4ed8aa4a, 0xe3418acb),
        int64(0x5b9cca4f, 0x7763e373), int64(0x682e6ff3, 0xd6b2b8a3),
        int64(0x748f82ee, 0x5defb2fc), int64(0x78a5636f, 0x43172f60),
        int64(0x84c87814, 0xa1f0ab72), int64(0x8cc70208, 0x1a6439ec),
        int64(0x90befffa, 0x23631e28), int64(0xa4506ceb, 0xde82bde9),
        int64(0xbef9a3f7, 0xb2c67915), int64(0xc67178f2, 0xe372532b),
        int64(0xca273ece, 0xea26619c), int64(0xd186b8c7, 0x21c0c207),
        int64(0xeada7dd6, 0xcde0eb1e), int64(0xf57d4f7f, 0xee6ed178),
        int64(0x06f067aa, 0x72176fba), int64(0x0a637dc5, 0xa2c898a6),
        int64(0x113f9804, 0xbef90dae), int64(0x1b710b35, 0x131c471b),
        int64(0x28db77f5, 0x23047d84), int64(0x32caab7b, 0x40c72493),
        int64(0x3c9ebe0a, 0x15c9bebc), int64(0x431d67c4, 0x9c100d4c),
        int64(0x4cc5d4be, 0xcb3e42b6), int64(0x597f299c, 0xfc657e2a),
        int64(0x5fcb6fab, 0x3ad6faec), int64(0x6c44198c, 0x4a475817)
    ];

    var W = new Array(80);
    for (var i = 0; i < 80; i++) W[i] = int64(0, 0);

    str = str.replace(/\r\n/g, "\n");
    var utf8 = '';
    for (var n = 0; n < str.length; n++) {
        var c = str.charCodeAt(n);
        if (c < 128) {
            utf8 += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utf8 += String.fromCharCode((c >> 6) | 192);
            utf8 += String.fromCharCode((c & 63) | 128);
        } else {
            utf8 += String.fromCharCode((c >> 12) | 224);
            utf8 += String.fromCharCode(((c >> 6) & 63) | 128);
            utf8 += String.fromCharCode((c & 63) | 128);
        }
    }

    str = utf8;
    var str_len = str.length;
    str += String.fromCharCode(0x80);
    var bin_len = str_len + 1;
    while (bin_len % 128 != 112) {
        str += String.fromCharCode(0);
        bin_len++;
    }

    var str_len_x8 = str_len * 8;
    str += String.fromCharCode((str_len_x8 >>> 56) & 0xFF);
    str += String.fromCharCode((str_len_x8 >>> 48) & 0xFF);
    str += String.fromCharCode((str_len_x8 >>> 40) & 0xFF);
    str += String.fromCharCode((str_len_x8 >>> 32) & 0xFF);
    str += String.fromCharCode((str_len_x8 >>> 24) & 0xFF);
    str += String.fromCharCode((str_len_x8 >>> 16) & 0xFF);
    str += String.fromCharCode((str_len_x8 >>> 8) & 0xFF);
    str += String.fromCharCode(str_len_x8 & 0xFF);

    for (var i = 0; i < str.length; i += 128) {
        for (var j = 0; j < 16; j++) {
            var offset = i + j * 8;
            W[j].h = (str.charCodeAt(offset) << 24) | (str.charCodeAt(offset + 1) << 16) | (str.charCodeAt(offset + 2) << 8) | str.charCodeAt(offset + 3);
            W[j].l = (str.charCodeAt(offset + 4) << 24) | (str.charCodeAt(offset + 5) << 16) | (str.charCodeAt(offset + 6) << 8) | str.charCodeAt(offset + 7);
        }

        for (var j = 16; j < 80; j++) {
            var s0 = int64(0, 0), s1 = int64(0, 0);
            int64rrot(s0, W[j - 15], 1);
            int64revrrot(s1, W[j - 15], 8);
            s0.l ^= s1.l; s0.h ^= s1.h;
            int64shr(s1, W[j - 15], 7);
            s0.l ^= s1.l; s0.h ^= s1.h;
            
            int64rrot(s1, W[j - 2], 19);
            int64revrrot(var_temp = int64(0, 0), W[j - 2], 61);
            s1.l ^= var_temp.l; s1.h ^= var_temp.h;
            int64shr(var_temp, W[j - 2], 6);
            s1.l ^= var_temp.l; s1.h ^= var_temp.h;

            int64add4(W[j], s0, W[j - 7], s1, W[j - 16]);
        }

        var a = int64(0, 0), b = int64(0, 0), c = int64(0, 0), d = int64(0, 0), e = int64(0, 0), f = int64(0, 0), g = int64(0, 0), h = int64(0, 0);
        int64copy(a, H[0]); int64copy(b, H[1]); int64copy(c, H[2]); int64copy(d, H[3]);
        int64copy(e, H[4]); int64copy(f, H[5]); int64copy(g, H[6]); int64copy(h, H[7]);

        for (var j = 0; j < 80; j++) {
            var S1 = int64(0, 0), ch = int64(0, 0), temp1 = int64(0, 0), S0 = int64(0, 0), maj = int64(0, 0), temp2 = int64(0, 0);

            int64rrot(S1, e, 14);
            int64revrrot(var_temp = int64(0, 0), e, 18);
            S1.l ^= var_temp.l; S1.h ^= var_temp.h;
            int64revrrot(var_temp, e, 41);
            S1.l ^= var_temp.l; S1.h ^= var_temp.h;

            ch.l = (e.l & f.l) ^ (~e.l & g.l);
            ch.h = (e.h & f.h) ^ (~e.h & g.h);

            int64add5(temp1, h, S1, ch, K[j], W[j]);

            int64rrot(S0, a, 28);
            int64revrrot(var_temp = int64(0, 0), a, 34);
            S0.l ^= var_temp.l; S0.h ^= var_temp.h;
            int64revrrot(var_temp, a, 39);
            S0.l ^= var_temp.l; S0.h ^= var_temp.h;

            maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
            maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);

            int64add(temp2, S0, maj);

            int64copy(h, g);
            int64copy(g, f);
            int64copy(f, e);
            int64add(e, d, temp1);
            int64copy(d, c);
            int64copy(c, b);
            int64copy(b, a);
            int64add(a, temp1, temp2);
        }

        int64add(H[0], H[0], a);
        int64add(H[1], H[1], b);
        int64add(H[2], H[2], c);
        int64add(H[3], H[3], d);
        int64add(H[4], H[4], e);
        int64add(H[5], H[5], f);
        int64add(H[6], H[6], g);
        int64add(H[7], H[7], h);
    }

    var hash = '';
    for (var i = 0; i < 8; i++) {
        hash += ("00000000" + H[i].h.toString(16)).slice(-8) + ("00000000" + H[i].l.toString(16)).slice(-8);
    }
    return hash;
}

function updateHashes() {
    const input = document.getElementById('inputText').value;
    const md5Result = document.getElementById('md5Result');
    const sha1Result = document.getElementById('sha1Result');
    const sha256Result = document.getElementById('sha256Result');
    const sha512Result = document.getElementById('sha512Result');
    
    if (input) {
        md5Result.value = md5(input);
        sha1Result.value = sha1(input);
        sha256Result.value = sha256(input);
        sha512Result.value = sha512(input);
    } else {
        md5Result.value = '';
        sha1Result.value = '';
        sha256Result.value = '';
        sha512Result.value = '';
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    
    const button = element.nextElementSibling;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 1500);
}

function clearText() {
    document.getElementById('inputText').value = '';
    updateHashes();
}

function switchTab(tab) {
    const textTab = document.getElementById('textTab');
    const fileTab = document.getElementById('fileTab');
    const batchTab = document.getElementById('batchTab');
    const textInput = document.getElementById('textInput');
    const fileInput = document.getElementById('fileInput');
    const batchInput = document.getElementById('batchInput');
    const outputSection = document.getElementById('.output-section');
    const batchResults = document.getElementById('batchResults');
    
    // Reset all tabs
    textTab.classList.remove('active');
    fileTab.classList.remove('active');
    batchTab.classList.remove('active');
    textInput.style.display = 'none';
    fileInput.style.display = 'none';
    batchInput.style.display = 'none';
    
    if (tab === 'text') {
        textTab.classList.add('active');
        textInput.style.display = 'block';
        batchResults.style.display = 'none';
        document.querySelector('.output-section').style.display = 'block';
        updateHashes();
    } else if (tab === 'file') {
        fileTab.classList.add('active');
        fileInput.style.display = 'block';
        batchResults.style.display = 'none';
        document.querySelector('.output-section').style.display = 'block';
        if (document.getElementById('fileInput').files.length > 0) {
            processFile(document.getElementById('fileInput').files[0]);
        } else {
            clearHashes();
        }
    } else if (tab === 'batch') {
        batchTab.classList.add('active');
        batchInput.style.display = 'block';
        document.querySelector('.output-section').style.display = 'none';
        if (document.getElementById('batchResultsTable').innerHTML) {
            batchResults.style.display = 'block';
        }
    }
}

function handleFileSelect(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        document.getElementById('fileName').textContent = `File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        document.getElementById('fileUploadArea').style.display = 'none';
        document.getElementById('fileInfo').style.display = 'block';
        processFile(file);
    }
}

function processFile(file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File too large. Please select a file smaller than 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        generateFileHashes(content);
    };
    reader.readAsText(file);
}

function generateFileHashes(content) {
    const md5Result = document.getElementById('md5Result');
    const sha1Result = document.getElementById('sha1Result');
    const sha256Result = document.getElementById('sha256Result');
    const sha512Result = document.getElementById('sha512Result');
    
    md5Result.value = md5(content);
    sha1Result.value = sha1(content);
    sha256Result.value = sha256(content);
    sha512Result.value = sha512(content);
}

function clearFile() {
    document.getElementById('fileInput').value = '';
    document.getElementById('fileUploadArea').style.display = 'block';
    document.getElementById('fileInfo').style.display = 'none';
    clearHashes();
}

function clearHashes() {
    document.getElementById('md5Result').value = '';
    document.getElementById('sha1Result').value = '';
    document.getElementById('sha256Result').value = '';
    document.getElementById('sha512Result').value = '';
}

// Drag and drop functionality
document.getElementById('fileUploadArea').addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#667eea';
});

document.getElementById('fileUploadArea').addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.borderColor = '#cbd5e0';
});

document.getElementById('fileUploadArea').addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = '#cbd5e0';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('fileInput').files = files;
        handleFileSelect(document.getElementById('fileInput'));
    }
});

let batchData = [];

function processBatch() {
    const batchText = document.getElementById('batchText').value;
    if (!batchText.trim()) {
        alert('Please enter some text to process.');
        return;
    }
    
    const lines = batchText.split('\n').filter(line => line.trim() !== '');
    batchData = [];
    
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
            batchData.push({
                index: index + 1,
                input: trimmedLine,
                md5: md5(trimmedLine),
                sha1: sha1(trimmedLine),
                sha256: sha256(trimmedLine),
                sha512: sha512(trimmedLine)
            });
        }
    });
    
    displayBatchResults();
    document.getElementById('batchResults').style.display = 'block';
}

function displayBatchResults() {
    const tableContainer = document.getElementById('batchResultsTable');
    
    let html = '<table class="batch-table">';
    html += '<thead><tr><th>#</th><th>Input</th><th>MD5</th><th>SHA-1</th><th>SHA-256</th><th>SHA-512</th></tr></thead>';
    html += '<tbody>';
    
    batchData.forEach(row => {
        html += `<tr>
            <td>${row.index}</td>
            <td>${row.input.length > 30 ? row.input.substring(0, 30) + '...' : row.input}</td>
            <td title="${row.md5}">${row.md5.substring(0, 16)}...</td>
            <td title="${row.sha1}">${row.sha1.substring(0, 16)}...</td>
            <td title="${row.sha256}">${row.sha256.substring(0, 16)}...</td>
            <td title="${row.sha512}">${row.sha512.substring(0, 16)}...</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    tableContainer.innerHTML = html;
}

function clearBatch() {
    document.getElementById('batchText').value = '';
    document.getElementById('batchResults').style.display = 'none';
    batchData = [];
}

function exportResults() {
    if (batchData.length === 0) {
        alert('No data to export. Please process some text first.');
        return;
    }
    
    let csv = 'Index,Input,MD5,SHA-1,SHA-256,SHA-512\n';
    batchData.forEach(row => {
        csv += `${row.index},"${row.input}","${row.md5}","${row.sha1}","${row.sha256}","${row.sha512}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hash_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function toggleHelp() {
    const helpContent = document.getElementById('helpContent');
    helpContent.style.display = helpContent.style.display === 'none' ? 'block' : 'none';
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Close help with Escape
    if (e.key === 'Escape') {
        document.getElementById('helpContent').style.display = 'none';
        return;
    }
    
    // Only handle ctrl combinations
    if (!e.ctrlKey) return;
    
    switch(e.key) {
        case '1':
            e.preventDefault();
            switchTab('text');
            break;
        case '2':
            e.preventDefault();
            switchTab('file');
            break;
        case '3':
            e.preventDefault();
            switchTab('batch');
            break;
        case 'Enter':
            e.preventDefault();
            if (document.getElementById('batchTab').classList.contains('active')) {
                processBatch();
            }
            break;
        case 'k':
        case 'K':
            e.preventDefault();
            const activeTab = document.querySelector('.tab-button.active').id;
            if (activeTab === 'textTab') {
                clearText();
            } else if (activeTab === 'fileTab') {
                clearFile();
            } else if (activeTab === 'batchTab') {
                clearBatch();
            }
            break;
    }
});

// Click outside help to close
document.addEventListener('click', function(e) {
    const helpSection = document.querySelector('.help-section');
    if (!helpSection.contains(e.target)) {
        document.getElementById('helpContent').style.display = 'none';
    }
});

document.getElementById('inputText').addEventListener('input', updateHashes);