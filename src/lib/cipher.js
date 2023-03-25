export async function hash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
  
    return crypto.subtle.digest('SHA-256', data).then(buffer => {
      let hex = '';
      const view = new DataView(buffer);
      for (let i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i);
        const stringValue = value.toString(16);
        const padding = '00000000';
        const paddedValue = (padding + stringValue).slice(-padding.length);
        hex += paddedValue;
      }
      return hex;
    });
  }