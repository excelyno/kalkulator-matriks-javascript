document.getElementById('matrix-size').addEventListener('change', generateMatrixInput);
document.getElementById('calculate-btn').addEventListener('click', calculateMatrix);

function generateMatrixInput() {
    const size = parseInt(document.getElementById('matrix-size').value);
    const container = document.getElementById('matrix-input');
    container.innerHTML = '';

    // Create matrix grid container
    const matrixGrid = document.createElement('div');
    matrixGrid.classList.add('matrix-grid');
    matrixGrid.style.display = 'grid';
    matrixGrid.style.gridTemplateColumns = `repeat(${size}, 70px)`;
    matrixGrid.style.gap = '10px';
    matrixGrid.style.justifyContent = 'center';
    matrixGrid.style.margin = '20px 0';

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('matrix-cell');
            input.setAttribute('data-row', i);
            input.setAttribute('data-col', j);
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.textAlign = 'center';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '4px';
            matrixGrid.appendChild(input);
        }
    }
    container.appendChild(matrixGrid);
}

function calculateMatrix() {
    const size = parseInt(document.getElementById('matrix-size').value);
    const matrix = [];
    const inputs = document.querySelectorAll('.matrix-cell');
    const steps = [];

    // Parse matrix inputs
    inputs.forEach(input => {
        const row = parseInt(input.getAttribute('data-row'));
        const col = parseInt(input.getAttribute('data-col'));
        if (!matrix[row]) matrix[row] = [];
        matrix[row][col] = parseFloat(input.value) || 0;
    });

    // Create styled result container
    const resultContainer = document.getElementById('steps');
    resultContainer.innerHTML = '';
    resultContainer.style.backgroundColor = '#f8f9fa';
    resultContainer.style.padding = '20px';
    resultContainer.style.borderRadius = '8px';
    resultContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

    // Show input matrix
    addStepToResults('Matriks yang dimasukkan:', matrixToString(matrix), resultContainer);
    addStepToResults('Penjelasan:', 'Ini adalah matriks awal yang akan kita hitung determinan, adjoin, dan inversnya.', resultContainer);

    // Determinant
    let determinant = 0;
    if (size === 2) {
        addStepToResults('Rumus Determinan 2x2:', 'Det = (a11 × a22) - (a12 × a21)', resultContainer);
        determinant = getDeterminant2x2(matrix, steps);
    } else if (size === 3) {
        addStepToResults('Rumus Determinan 3x3:', 
            'Det = a11(a22×a33 - a23×a32) - a12(a21×a33 - a23×a31) + a13(a21×a32 - a22×a31)', 
            resultContainer);
        determinant = getDeterminant3x3(matrix, steps);
    }

    steps.forEach(step => {
        addStepToResults('Langkah Perhitungan:', step, resultContainer);
    });
    addStepToResults('Determinan:', determinant, resultContainer);

    // Adjoint
    let adjoint = [];
    if (size === 2 || size === 3) {
        if (size === 2) {
            addStepToResults('Rumus Adjoin 2x2:', 
                'Untuk matriks 2x2, adjoin didapat dengan:\n1. Menukar posisi a11 dengan a22\n2. Mengubah tanda a12 dan a21 menjadi negatif', 
                resultContainer);
        } else {
            addStepToResults('Rumus Adjoin 3x3:', 
                'Untuk matriks 3x3, setiap elemen adjoin adalah kofaktor yang ditranspose.\nKofaktor = (-1)^(i+j) × determinan minor', 
                resultContainer);
        }
        adjoint = getAdjoint(matrix, steps);
        addStepToResults('Adjoin matriks:', matrixToString(adjoint), resultContainer);
    }

    // Inverse
    if (determinant !== 0) {
        addStepToResults('Rumus Invers:', 'Invers = (1/determinan) × adjoin', resultContainer);
        const inverse = getInverse(adjoint, determinant, steps);
        addStepToResults('Invers matriks:', matrixToString(inverse), resultContainer);
        addStepToResults('Verifikasi:', 'Untuk memastikan hasil benar, kalikan matriks awal dengan inversnya.\nHasilnya harus mendekati matriks identitas.', resultContainer);
    } else {
        addStepToResults('Peringatan:', 'Invers tidak ada karena determinan = 0\nMatriks singular tidak memiliki invers.', resultContainer);
    }
}

function addStepToResults(title, content, container) {
    const stepDiv = document.createElement('div');
    stepDiv.style.marginBottom = '20px';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.color = '#007bff';
    titleEl.style.marginBottom = '10px';
    
    const contentEl = document.createElement('pre');
    contentEl.textContent = content;
    contentEl.style.fontFamily = 'monospace';
    contentEl.style.backgroundColor = '#fff';
    contentEl.style.padding = '10px';
    contentEl.style.borderRadius = '4px';
    contentEl.style.border = '1px solid #dee2e6';
    
    stepDiv.appendChild(titleEl);
    stepDiv.appendChild(contentEl);
    container.appendChild(stepDiv);
}

function getDeterminant2x2(matrix, steps) {
    const a = matrix[0][0], b = matrix[0][1], 
          c = matrix[1][0], d = matrix[1][1];
    const det = (a * d) - (b * c);
    steps.push(
        `Determinan 2x2 dihitung dengan rumus:\n` +
        `(${a} × ${d}) - (${b} × ${c})\n` +
        `= ${a*d} - ${b*c}\n` +
        `= ${det}`
    );
    return det;
}

function getDeterminant3x3(matrix, steps) {
    const [a1, a2, a3] = matrix[0];
    const [b1, b2, b3] = matrix[1];
    const [c1, c2, c3] = matrix[2];

    const part1 = a1 * (b2 * c3 - b3 * c2);
    const part2 = a2 * (b1 * c3 - b3 * c1);
    const part3 = a3 * (b1 * c2 - b2 * c1);
    const det = part1 - part2 + part3;

    steps.push(
        `Determinan 3x3 dihitung dengan:\n` +
        `1. ${a1} × [(${b2}×${c3}) - (${b3}×${c2})] = ${part1}\n` +
        `2. ${a2} × [(${b1}×${c3}) - (${b3}×${c1})] = ${part2}\n` +
        `3. ${a3} × [(${b1}×${c2}) - (${b2}×${c1})] = ${part3}\n` +
        `4. Hasil akhir = ${part1} - ${part2} + ${part3} = ${det}`
    );

    return det;
}

function getAdjoint(matrix, steps) {
    const size = matrix.length;
    const adjoint = Array.from({ length: size }, () => Array(size).fill(0));

    if (size === 2) {
        adjoint[0][0] = matrix[1][1];
        adjoint[0][1] = -matrix[0][1];
        adjoint[1][0] = -matrix[1][0];
        adjoint[1][1] = matrix[0][0];
        steps.push(
            `Langkah menghitung adjoin 2x2:\n` +
            `1. Tukar elemen diagonal utama (a11 ↔ a22)\n` +
            `2. Ubah tanda elemen diagonal lain (a12 dan a21)\n` +
            `Hasil:\n${matrixToString(adjoint)}`
        );
    } else if (size === 3) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const minor = getMinor(matrix, i, j);
                const cofactor = Math.pow(-1, i + j) * getDeterminant2x2(minor, []);
                adjoint[j][i] = cofactor;
                steps.push(
                    `Menghitung kofaktor untuk posisi (${i+1},${j+1}):\n` +
                    `1. Determinan minor = ${getDeterminant2x2(minor, [])}\n` +
                    `2. Kofaktor = (-1)^(${i+1}+${j+1}) × ${getDeterminant2x2(minor, [])} = ${cofactor}`
                );
            }
        }
    }

    return adjoint;
}

function getMinor(matrix, row, col) {
    const minor = matrix
        .filter((_, i) => i !== row)
        .map(row => row.filter((_, j) => j !== col));
    return minor;
}

function getInverse(adjoint, determinant, steps) {
    const inverse = adjoint.map(row => 
        row.map(value => {
            const result = value / determinant;
            return Math.round(result * 1000) / 1000; // Round to 3 decimal places
        })
    );
    steps.push(
        `Langkah menghitung invers:\n` +
        `1. Setiap elemen adjoin dibagi dengan determinan (${determinant})\n` +
        `2. Hasil pembagian dibulatkan ke 3 angka desimal\n` +
        `Hasil akhir:\n${matrixToString(inverse)}`
    );
    return inverse;
}

function matrixToString(matrix) {
    return matrix.map(row => row.map(val => 
        typeof val === 'number' ? val.toFixed(3) : val
    ).join('\t')).join('\n');
}
