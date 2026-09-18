// Compact, dependency-free MD5 implementation (UTF-8 safe).
function rotateLeft(x: number, c: number) {
  return (x << c) | (x >>> (32 - c));
}

function toUtf8Bytes(str: string): number[] {
  return Array.from(new TextEncoder().encode(str));
}

export function md5(input: string): string {
  const K = new Array(64);
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32);
  }
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15,
    21,
  ];

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const bytes = toUtf8Bytes(input);
  const originalLengthBits = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);

  const lengthBytes = new Array(8).fill(0);
  let lenLow = originalLengthBits >>> 0;
  let lenHigh = Math.floor(originalLengthBits / 2 ** 32) >>> 0;
  for (let i = 0; i < 4; i++) {
    lengthBytes[i] = lenLow & 0xff;
    lenLow >>>= 8;
  }
  for (let i = 4; i < 8; i++) {
    lengthBytes[i] = lenHigh & 0xff;
    lenHigh >>>= 8;
  }
  bytes.push(...lengthBytes);

  for (let chunkStart = 0; chunkStart < bytes.length; chunkStart += 64) {
    const M = new Array(16);
    for (let i = 0; i < 16; i++) {
      const offset = chunkStart + i * 4;
      M[i] = bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
    }

    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    for (let i = 0; i < 64; i++) {
      let F = 0;
      let g = 0;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotateLeft(F, S[i])) | 0;
    }

    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }

  const toHex = (n: number) => {
    let hex = "";
    for (let i = 0; i < 4; i++) {
      hex += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    }
    return hex;
  };

  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}
