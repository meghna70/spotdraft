export function formatBits(bits) {
    const parsedBits = parseInt(bits, 10);
  
    if (isNaN(parsedBits) || parsedBits <= 0) return '0 bits';
  
    const units = ['bits', 'Kb', 'Mb', 'Gb', 'Tb'];
    let index = 0;
    let size = parsedBits;
  
    while (size >= 1000 && index < units.length - 1) {
      size /= 1000;
      index++;
    }
  
    return `${size.toFixed(2)} ${units[index]}`;
  }
  