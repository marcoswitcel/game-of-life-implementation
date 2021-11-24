

/**
 * 
 * @param {Object} param0
 * @param {Number} param0.width Largura do retângulo
 * @param {Number} param0.height Altura do retângulo
 * @param {HTMLElement?} [param0.appendTo] Elemento ao qual o canvas deve ser adicionado,
 * caso não quiser adicionar o canvas ao elemento automaticamente,
 * pode ignorar esse atributo
 * 
 * @returns {HTMLCanvasElement}
 */
export function canvasFactory({ width, height, appendTo = null }) {
    const canvas = document.createElement('canvas');
    const style = canvas.style;
    
    canvas.width = width;
    canvas.height = height;

    style.setProperty('image-rendering', '-moz-crisp-edges');
    style.setProperty('image-rendering', '-webkit-crisp-edges');
    style.setProperty('image-rendering', 'pixelated');
    style.setProperty('image-rendering', 'crisp-edges');
    style.setProperty('width', '100%');

    if (appendTo) {
        appendTo.appendChild(canvas);
    }

    return canvas;
}

/**
 * 
 * @param {ImageData} imageData 
 * @param {import('./colors.js').iRGBAColor} color 
 */
export function clear(imageData, color = 0xFFFFFFFF) {
    const uint32bitArray =  new Uint32Array(imageData.data.buffer);
    
    for (let i = uint32bitArray.length | 0; i--; ) {
        uint32bitArray[i] = color;
    }
}
