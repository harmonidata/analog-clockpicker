/**
 * Dial Numbers and SVG Needle Renderer
 */

export function renderDialNumbers(containerEl, mode, format24, selectedValue, size = 280) {
  if (!containerEl) return;
  containerEl.innerHTML = '';
  const center = size / 2;

  if (mode === 'hours') {
    if (format24) {
      // 24-Hour mode: Outer Ring (1-12), Inner Ring (13-23, 00)
      const outerRadius = (size / 2) * 0.74;
      const innerRadius = (size / 2) * 0.48;

      // Outer ring 1-12
      for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + outerRadius * Math.cos(angle);
        const y = center + outerRadius * Math.sin(angle);

        const numEl = document.createElement('div');
        numEl.className = `tw-clock-num absolute flex items-center justify-center font-mono-num font-bold text-xs transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-150 ${
          selectedValue === i ? 'text-white font-extrabold z-20' : 'text-slate-700 dark:text-slate-300'
        }`;
        numEl.style.left = `${(x / size) * 100}%`;
        numEl.style.top = `${(y / size) * 100}%`;
        numEl.dataset.value = i;
        numEl.textContent = i;
        containerEl.appendChild(numEl);
      }

      // Inner ring 13-23, 00
      for (let i = 13; i <= 24; i++) {
        const val = i === 24 ? 0 : i;
        const step = i - 12;
        const angle = (step * 30 - 90) * (Math.PI / 180);
        const x = center + innerRadius * Math.cos(angle);
        const y = center + innerRadius * Math.sin(angle);

        const numEl = document.createElement('div');
        numEl.className = `tw-clock-num absolute flex items-center justify-center font-mono-num font-semibold text-[10px] transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-150 ${
          selectedValue === val ? 'text-white font-extrabold z-20' : 'text-slate-400 dark:text-slate-500'
        }`;
        numEl.style.left = `${(x / size) * 100}%`;
        numEl.style.top = `${(y / size) * 100}%`;
        numEl.dataset.value = val;
        numEl.textContent = val === 0 ? '00' : val;
        containerEl.appendChild(numEl);
      }
    } else {
      // 12-Hour mode
      const radius = (size / 2) * 0.70;
      for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        const numEl = document.createElement('div');
        numEl.className = `tw-clock-num absolute flex items-center justify-center font-mono-num font-bold text-sm transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-150 ${
          selectedValue === i ? 'text-white font-extrabold z-20' : 'text-slate-700 dark:text-slate-300'
        }`;
        numEl.style.left = `${(x / size) * 100}%`;
        numEl.style.top = `${(y / size) * 100}%`;
        numEl.dataset.value = i;
        numEl.textContent = i;
        containerEl.appendChild(numEl);
      }
    }
  } else {
    // Minutes mode (00, 05, 10, ... 55)
    const radius = (size / 2) * 0.70;

    // Minor minute tick dots
    for (let m = 0; m < 60; m++) {
      if (m % 5 !== 0) {
        const angle = (m * 6 - 90) * (Math.PI / 180);
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        const dotEl = document.createElement('div');
        dotEl.className = 'absolute w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none';
        dotEl.style.left = `${(x / size) * 100}%`;
        dotEl.style.top = `${(y / size) * 100}%`;
        containerEl.appendChild(dotEl);
      }
    }

    // Major numbers every 5 mins
    for (let i = 0; i < 60; i += 5) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);

      const numEl = document.createElement('div');
      numEl.className = `tw-clock-num absolute flex items-center justify-center font-mono-num font-bold text-xs transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-150 ${
        selectedValue === i ? 'text-white font-extrabold z-20' : 'text-slate-700 dark:text-slate-300'
      }`;
      numEl.style.left = `${(x / size) * 100}%`;
      numEl.style.top = `${(y / size) * 100}%`;
      numEl.dataset.value = i;
      numEl.textContent = i.toString().padStart(2, '0');
      containerEl.appendChild(numEl);
    }
  }
}

/**
 * Creates SVG needle and dial DOM structure
 */
export function createDialElement(size = 280) {
  const center = size / 2;
  const initialY = center - 98;

  const dialWrapper = document.createElement('div');
  dialWrapper.className = `tw-clock-dial relative w-[${size}px] h-[${size}px] rounded-full bg-slate-50 dark:bg-slate-800/80 border-4 border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center no-select cursor-pointer touch-none select-none`;
  dialWrapper.style.width = `${size}px`;
  dialWrapper.style.height = `${size}px`;

  // Center pivot
  const pivot = document.createElement('div');
  pivot.className = 'absolute z-30 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900 pointer-events-none';

  // SVG Needle
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'absolute inset-0 w-full h-full pointer-events-none z-10');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

  const handGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  handGroup.setAttribute('transform', `rotate(300, ${center}, ${center})`);

  const handLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  handLine.setAttribute('x1', center);
  handLine.setAttribute('y1', center);
  handLine.setAttribute('x2', center);
  handLine.setAttribute('y2', initialY);
  handLine.setAttribute('stroke', 'currentColor');
  handLine.setAttribute('stroke-width', '2');
  handLine.setAttribute('class', 'text-indigo-600 dark:text-indigo-500');

  const handBubble = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  handBubble.setAttribute('cx', center);
  handBubble.setAttribute('cy', initialY);
  handBubble.setAttribute('r', '17');
  handBubble.setAttribute('class', 'fill-indigo-600 dark:fill-indigo-500 shadow-md');

  const handDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  handDot.setAttribute('cx', center);
  handDot.setAttribute('cy', initialY);
  handDot.setAttribute('r', '3');
  handDot.setAttribute('class', 'fill-white hidden');

  handGroup.appendChild(handLine);
  handGroup.appendChild(handBubble);
  handGroup.appendChild(handDot);
  svg.appendChild(handGroup);

  // Dial numbers container
  const numbersContainer = document.createElement('div');
  numbersContainer.className = 'absolute inset-0 z-20 pointer-events-none dial-fade-enter';

  dialWrapper.appendChild(pivot);
  dialWrapper.appendChild(svg);
  dialWrapper.appendChild(numbersContainer);

  return {
    dialWrapper,
    handGroup,
    handLine,
    handBubble,
    handDot,
    numbersContainer
  };
}
