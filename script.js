// Estado global de la aplicación
const appState = {
    currentTheme: 'dark',
    currentQuizQuestion: 0,
    quizAnswers: [],
    codeExamples: 0,
    concepts: 0,
    exercises: 0
};

// Datos del quiz
const quizData = [
    {
        question: "¿Qué imprime este código?",
        code: `let x = 5\nlet y = x + 3\nprintfn "%d" y`,
        options: ["5", "8", "Error", "3"],
        correct: 1,
        explanation: "x vale 5, y vale 5 + 3 = 8"
    },
    {
        question: "¿Cuál es el resultado de esta función?",
        code: `let duplicar lista = \n    lista |> List.map (fun x -> x * 2)\nduplicar [1; 2; 3]`,
        options: ["[1; 2; 3]", "[2; 4; 6]", "[1; 4; 9]", "Error"],
        correct: 1,
        explanation: "List.map aplica la función a cada elemento: 1*2=2, 2*2=4, 3*2=6"
    },
    {
        question: "¿Qué hace este pattern matching?",
        code: `match x with\n| 0 -> "Cero"\n| 1 -> "Uno"\n| _ -> "Otro"`,
        options: [
            "Siempre retorna 'Cero'",
            "Clasifica números en categorías",
            "Suma números",
            "Filtra lista"
        ],
        correct: 1,
        explanation: "El pattern matching compara x con diferentes patrones y retorna el texto correspondiente"
    },
    {
        question: "¿Cómo se define un Record en F#?",
        code: `type Persona = {\n    Nombre: string\n    Edad: int\n}`,
        options: [
            "Con class y propiedades",
            "Con interfaces",
            "Con la sintaxis { campo: tipo }",
            "No se puede definir"
        ],
        correct: 2,
        explanation: "Los records se definen con la sintaxis type Nombre = { campo1: tipo1; campo2: tipo2 }"
    },
    {
        question: "¿Qué significa el operador |> ?",
        code: `[1..5] \n|> List.filter (fun x -> x > 2)\n|> List.sum`,
        options: [
            "Asignación",
            "Pipe forward - pasa resultado como último parámetro",
            "Comparación",
            "División"
        ],
        correct: 1,
        explanation: "El pipe forward (|>) toma el resultado de la izquierda y lo pasa como último parámetro a la función de la derecha"
    }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarAplicacion();
    inicializarTema();
    inicializarNavegacion();
    inicializarContadores();
    inicializarQuiz();
    inicializarSimulador();
    inicializarInteractivos();
});

function inicializarAplicacion() {
    console.log('🚀 F# Master inicializado');
    
    // Resaltar sintaxis
    Prism.highlightAll();
    
    // Animaciones de entrada
    animarElementos();
    
    // Inicializar tooltips para conceptos
    inicializarTooltips();
}

// Sistema de Temas
function inicializarTema() {
    const savedTheme = localStorage.getItem('fsharp-theme');
    if (savedTheme) {
        appState.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        actualizarIconoTema();
    }
    
    document.getElementById('themeToggle').addEventListener('click', toggleTema);
}

function toggleTema() {
    appState.currentTheme = appState.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', appState.currentTheme);
    localStorage.setItem('fsharp-theme', appState.currentTheme);
    actualizarIconoTema();
}

function actualizarIconoTema() {
    const icon = document.querySelector('#themeToggle i');
    icon.className = appState.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Navegación y Scroll
function inicializarNavegacion() {
    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Actualizar navegación activa al hacer scroll
    window.addEventListener('scroll', actualizarNavegacionActiva);
    
    // Progress dots
    document.querySelectorAll('.progress-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function actualizarNavegacionActiva() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
    
    // Actualizar progress dots
    document.querySelectorAll('.progress-dot').forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-target') === currentSection) {
            dot.classList.add('active');
        }
    });
}

// Contadores animados
function inicializarContadores() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animarContadores();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.hero-stats'));
}

function animarContadores() {
    const contadores = [
        { element: document.getElementById('conceptCount'), target: 15, duration: 2000 },
        { element: document.getElementById('exerciseCount'), target: 8, duration: 1500 },
        { element: document.getElementById('codeCount'), target: 25, duration: 2500 }
    ];
    
    contadores.forEach(contador => {
        let current = 0;
        const increment = contador.target / (contador.duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if (current >= contador.target) {
                current = contador.target;
                clearInterval(timer);
            }
            contador.element.textContent = Math.floor(current);
        }, 16);
    });
}

// Sistema de Demos Interactivas
function inicializarInteractivos() {
    // Toggle de ejemplos en concept cards
    document.querySelectorAll('.toggle-examples').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.closest('.concept-card').querySelector('.concept-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            this.textContent = content.style.display === 'none' ? 'Mostrar Ejemplos' : 'Ocultar Ejemplos';
        });
    });
}

// Demo: Generar Lista
function generarLista() {
    const input = document.getElementById('listaInput');
    const output = document.getElementById('listaOutput');
    const n = parseInt(input.value) || 5;
    
    if (n < 1 || n > 20) {
        output.innerHTML = '<span style="color: var(--danger)">Por favor ingresa un número entre 1 y 20</span>';
        return;
    }
    
    const lista = Array.from({length: n}, (_, i) => i + 1);
    const procesada = lista.map(x => x * 2).filter(x => x > 3);
    
    output.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Lista original:</strong> [${lista.join('; ')}]
        </div>
        <div>
            <strong>Lista procesada (doble y >3):</strong> [${procesada.join('; ')}]
        </div>
    `;
}

// Demo: Pattern Matching
function evaluarPattern() {
    const input = document.getElementById('patternInput');
    const output = document.getElementById('patternResult');
    const n = parseInt(input.value) || 5;
    
    let resultado = '';
    
    // Simular el pattern matching
    if (n === 0) {
        resultado = 'Cero';
    } else if (n === 1) {
        resultado = 'Uno';
    } else if (n < 0) {
        resultado = 'Negativo';
    } else if (n % 2 === 0) {
        resultado = 'Par positivo';
    } else {
        resultado = 'Impar positivo';
    }
    
    output.innerHTML = `
        <div style="color: var(--secondary); font-weight: 600;">
            clasificarNumero(${n}) = "${resultado}"
        </div>
        <div style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">
            Pattern matching evaluado correctamente
        </div>
    `;
}

// Sistema de Evaluación de Soluciones
function evaluarSolucion(numero) {
    const solucion = document.getElementById(`solucion${numero}`).value;
    
    switch(numero) {
        case 1:
            evaluarSolucion1(solucion);
            break;
        case 2:
            evaluarSolucion2(solucion);
            break;
    }
}

function evaluarSolucion1(codigo) {
    // Simulación básica - en un entorno real esto se haría con un compilador
    const tests = [
        { input: 5, expected: [1, 3, 5, 7, 9] },
        { input: 3, expected: [1, 3, 5] }
    ];
    
    tests.forEach((test, index) => {
        const resultElement = document.getElementById(`test1-${index + 1}`);
        
        // Verificación simple basada en contenido del código
        if (codigo.includes('2*') && codigo.includes('map') && codigo.includes('iter')) {
            resultElement.textContent = '✓ Correcto';
            resultElement.className = 'test-result pass';
        } else {
            resultElement.textContent = '✗ Revisar';
            resultElement.className = 'test-result fail';
        }
    });
}

function evaluarSolucion2(codigo) {
    // Simulación de evaluación para pregunta 1.b
    const tieneSortBy = codigo.includes('sortBy');
    const tienePIB = codigo.includes('pib') || codigo.includes('PIB');
    const tienePrint = codigo.includes('printfn') || codigo.includes('iter');
    
    if (tieneSortBy && tienePIB && tienePrint) {
        mostrarNotificacion('¡Solución correcta! 🎉', 'success');
    } else {
        mostrarNotificacion('Revisa tu solución. Debe incluir sortBy, acceso al PIB y printfn/iter.', 'error');
    }
}

// Simulador de Código
function inicializarSimulador() {
    // Ejemplos predefinidos que rotan
    const ejemplos = [
        `// Ejemplo 1: Operaciones con listas
let numeros = [1..10]
let resultado = 
    numeros
    |> List.filter (fun x -> x % 2 = 0)
    |> List.map (fun x -> x * 3)

printfn "Números pares multiplicados por 3: %A" resultado`,

        `// Ejemplo 2: Pattern Matching
type Estado = 
    | Activo 
    | Inactivo 
    | Suspendido of string

let describir estado =
    match estado with
    | Activo -> "Usuario activo"
    | Inactivo -> "Usuario inactivo" 
    | Suspendido razon -> $"Usuario suspendido: {razon}"

printfn "%s" (describir (Suspendido "Violación de términos"))`,

        `// Ejemplo 3: Records y Option
type Persona = {
    Nombre: string
    Edad: int
    Email: string option
}

let persona = {
    Nombre = "María"
    Edad = 25
    Email = Some "maria@email.com"
}

match persona.Email with
| Some email -> printfn "Email: %s" email
| None -> printfn "No tiene email"`
    ];
    
    let ejemploIndex = 0;
    setInterval(() => {
        document.getElementById('liveEditor').value = ejemplos[ejemploIndex];
        ejemploIndex = (ejemploIndex + 1) % ejemplos.length;
    }, 10000);
}

function ejecutarCodigo() {
    const codigo = document.getElementById('liveEditor').value;
    const output = document.getElementById('outputArea');
    
    // Simulación de ejecución - resultados predefinidos para ejemplos comunes
    const simulaciones = {
        '// Ejemplo 1: Operaciones con listas\nlet numeros = [1..10]\nlet resultado = \n    numeros\n    |> List.filter (fun x -> x % 2 = 0)\n    |> List.map (fun x -> x * 3)\n\nprintfn "Números pares multiplicados por 3: %A" resultado': 
            'Números pares multiplicados por 3: [6; 12; 18; 24; 30]',
            
        '// Ejemplo 2: Pattern Matching\ntype Estado = \n    | Activo \n    | Inactivo \n    | Suspendido of string\n\nlet describir estado =\n    match estado with\n    | Activo -> "Usuario activo"\n    | Inactivo -> "Usuario inactivo" \n    | Suspendido razon -> $"Usuario suspendido: {razon}"\n\nprintfn "%s" (describir (Suspendido "Violación de términos"))':
            'Usuario suspendido: Violación de términos',
            
        '// Ejemplo 3: Records y Option\ntype Persona = {\n    Nombre: string\n    Edad: int\n    Email: string option\n}\n\nlet persona = {\n    Nombre = "María"\n    Edad = 25\n    Email = Some "maria@email.com"\n}\n\nmatch persona.Email with\n| Some email -> printfn "Email: %s" email\n| None -> printfn "No tiene email"':
            'Email: maria@email.com'
    };
    
    let resultado = simulaciones[codigo];
    
    if (!resultado) {
        // Análisis básico del código para dar feedback
        if (codigo.includes('printfn') && codigo.includes('let')) {
            resultado = '✅ Código ejecutado correctamente\n💡 Tip: Este es un simulador básico. Para ejecución real usa F# Interactive.';
        } else {
            resultado = '⚠️  Este es un simulador básico de F#\n\nPara ejecutar código F# real necesitas:\n• .NET SDK instalado\n• F# Interactive (dotnet fsi)\n• O usa tryfsharp.org\n\nEl simulador muestra resultados para ejemplos predefinidos.';
        }
    }
    
    const outputLine = document.createElement('div');
    outputLine.className = 'output-line';
    outputLine.innerHTML = `
        <div class="output-header">
            <span class="output-timestamp">${new Date().toLocaleTimeString()}</span>
            <span class="output-status">Ejecutado</span>
        </div>
        <pre class="output-content">${resultado}</pre>
    `;
    
    // Remover mensaje de bienvenida si existe
    const welcomeMsg = output.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    output.appendChild(outputLine);
    output.scrollTop = output.scrollHeight;
}

function limpiarConsola() {
    document.getElementById('outputArea').innerHTML = `
        <div class="welcome-message">
            <i class="fas fa-info-circle"></i>
            <span>Escribe código F# en el panel izquierdo y presiona Ejecutar</span>
        </div>
    `;
}

// Sistema de Quiz
function inicializarQuiz() {
    mostrarPreguntaQuiz(0);
    actualizarProgresoQuiz();
}

function mostrarPreguntaQuiz(index) {
    const pregunta = quizData[index];
    const quizQuestion = document.getElementById('quizQuestion');
    
    quizQuestion.innerHTML = `
        <div class="question-text">
            <h3>${pregunta.question}</h3>
        </div>
        <div class="question-code">
            <pre><code class="language-fsharp">${pregunta.code}</code></pre>
        </div>
        <div class="question-options">
            ${pregunta.options.map((option, i) => `
                <label class="option-label">
                    <input type="radio" name="quiz" value="${i}" ${appState.quizAnswers[index] === i ? 'checked' : ''}>
                    <span class="option-text">${option}</span>
                </label>
            `).join('')}
        </div>
        ${appState.quizAnswers[index] !== undefined ? `
            <div class="question-explanation">
                <strong>Explicación:</strong> ${pregunta.explanation}
            </div>
        ` : ''}
    `;
    
    Prism.highlightAll();
    document.getElementById('quizCounter').textContent = `Pregunta ${index + 1}/${quizData.length}`;
}

function siguientePregunta() {
    // Guardar respuesta actual
    const selected = document.querySelector('input[name="quiz"]:checked');
    if (selected) {
        appState.quizAnswers[appState.currentQuizQuestion] = parseInt(selected.value);
    }
    
    if (appState.currentQuizQuestion < quizData.length - 1) {
        appState.currentQuizQuestion++;
        mostrarPreguntaQuiz(appState.currentQuizQuestion);
        actualizarProgresoQuiz();
    } else {
        // Mostrar resultados finales
        mostrarResultadosQuiz();
    }
}

function anteriorPregunta() {
    if (appState.currentQuizQuestion > 0) {
        appState.currentQuizQuestion--;
        mostrarPreguntaQuiz(appState.currentQuizQuestion);
        actualizarProgresoQuiz();
    }
}

function actualizarProgresoQuiz() {
    const progress = (appState.currentQuizQuestion / (quizData.length - 1)) * 100;
    document.getElementById('quizProgress').style.width = `${progress}%`;
}

function mostrarResultadosQuiz() {
    const correctas = appState.quizAnswers.reduce((acc, respuesta, index) => {
        return acc + (respuesta === quizData[index].correct ? 1 : 0);
    }, 0);
    
    const porcentaje = (correctas / quizData.length) * 100;
    
    document.getElementById('quizQuestion').innerHTML = `
        <div class="quiz-results">
            <div class="results-header">
                <h3>🎉 Quiz Completado</h3>
                <div class="results-score">
                    <span class="score-number">${correctas}/${quizData.length}</span>
                    <span class="score-percentage">${porcentaje.toFixed(1)}%</span>
                </div>
            </div>
            <div class="results-breakdown">
                ${quizData.map((pregunta, index) => `
                    <div class="result-item ${appState.quizAnswers[index] === pregunta.correct ? 'correct' : 'incorrect'}">
                        <span class="result-question">Pregunta ${index + 1}</span>
                        <span class="result-status">
                            ${appState.quizAnswers[index] === pregunta.correct ? '✓ Correcta' : '✗ Incorrecta'}
                        </span>
                    </div>
                `).join('')}
            </div>
            <button onclick="reiniciarQuiz()" class="quiz-btn primary">
                <i class="fas fa-redo"></i> Intentar Nuevamente
            </button>
        </div>
    `;
    
    document.querySelector('.quiz-actions').style.display = 'none';
}

function reiniciarQuiz() {
    appState.currentQuizQuestion = 0;
    appState.quizAnswers = [];
    document.querySelector('.quiz-actions').style.display = 'flex';
    mostrarPreguntaQuiz(0);
    actualizarProgresoQuiz();
}

// Utilidades
function animarElementos() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.concept-card, .exam-question, .quiz-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

function inicializarTooltips() {
    // Tooltips para conceptos comunes
    const tooltips = {
        '|>': 'Pipe Forward - Pasa el resultado como último parámetro',
        'match': 'Pattern Matching - Compara valores con patrones',
        'option': 'Tipo Option - Puede ser Some valor o None',
        'List.map': 'Transforma cada elemento de la lista',
        'List.filter': 'Filtra elementos que cumplan condición'
    };
    
    // Se podrían implementar tooltips flotantes aquí
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${tipo === 'success' ? 'var(--secondary)' : 'var(--danger)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px var(--shadow);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Estilos CSS para animaciones de notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .output-line {
        background: var(--surface-light);
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
        border-left: 4px solid var(--secondary);
    }
    
    .output-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
    
    .output-content {
        margin: 0;
        white-space: pre-wrap;
        font-family: 'Fira Code', monospace;
    }
    
    .option-label {
        display: flex;
        align-items: center;
        padding: 1rem;
        margin-bottom: 0.5rem;
        background: var(--surface-light);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .option-label:hover {
        background: var(--border);
        transform: translateX(5px);
    }
    
    .option-label input {
        margin-right: 1rem;
    }
    
    .quiz-results {
        text-align: center;
    }
    
    .results-header {
        margin-bottom: 2rem;
    }
    
    .results-score {
        margin-top: 1rem;
    }
    
    .score-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary);
    }
    
    .score-percentage {
        display: block;
        color: var(--text-secondary);
    }
    
    .result-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        border-radius: 0.5rem;
    }
    
    .result-item.correct {
        background: #10b98120;
        color: #10b981;
    }
    
    .result-item.incorrect {
        background: #ef444420;
        color: #ef4444;
    }
    
    .question-explanation {
        background: var(--surface-light);
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
        border-left: 4px solid var(--accent);
    }
`;
document.head.appendChild(style);

// Exportar funciones globales para HTML
window.generarLista = generarLista;
window.evaluarPattern = evaluarPattern;
window.evaluarSolucion = evaluarSolucion;
window.ejecutarCodigo = ejecutarCodigo;
window.limpiarConsola = limpiarConsola;
window.anteriorPregunta = anteriorPregunta;
window.siguientePregunta = siguientePregunta;
window.reiniciarQuiz = reiniciarQuiz;