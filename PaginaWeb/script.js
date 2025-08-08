 document.addEventListener('DOMContentLoaded', function() {
            // URLs y IDs
            const NOTEBOOKLM_CHAT_URL = "https://notebooklm.google.com/notebook/a07b0d8e-2f0e-4efe-b084-fd2fbf685fc1?authuser=1";
            const GENERAL_YOUTUBE_ID = "Xv5ZrnzA2DA"; // Reemplaza con el ID de tu video
            const SUMMARY_YOUTUBE_ID = "Xv5ZrnzA2DA"; // Reemplaza con el ID de tu video

            const toast = document.getElementById('toast-notification');
            const originalToastText = '¡Pregunta copiada al portapapeles!';
            toast.textContent = originalToastText;

            // --- Funciones de Filtrado ---
            function filterItems(searchQuery, containerSelector, itemSelector, textSelectors) {
                const container = document.querySelector(containerSelector);
                if (!container) return;
                const items = container.querySelectorAll(itemSelector);
                const query = searchQuery.toLowerCase().trim();

                items.forEach(item => {
                    let itemText = '';
                    textSelectors.forEach(selector => {
                        const element = item.querySelector(selector);
                        if (element) itemText += element.textContent.toLowerCase() + ' ';
                    });

                    if (itemText.includes(query)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }

            // --- FILTRO DEL GLOSARIO ---
            const glossarySearchInput = document.getElementById('glossary-search');
            if (glossarySearchInput) {
                glossarySearchInput.addEventListener('input', () => {
                    const query = glossarySearchInput.value.toLowerCase().trim();
                    document.querySelectorAll('.accordion-item').forEach(item => { // Iteramos sobre cada item del accordion que contiene el glosario
                        const list = item.querySelector('.glossary-list');
                        if (list) {
                            let listText = '';
                            list.querySelectorAll('dt, dd').forEach(term => {
                                listText += term.textContent.toLowerCase() + ' ';
                            });
                            
                            if (listText.includes(query)) {
                                item.style.display = ''; // Mostrar el item del accordion si el contenido del glosario coincide
                            } else {
                                item.style.display = 'none'; // Ocultar si no coincide
                            }
                        }
                    });
                });
            }
            // --- Fin de Funciones de Filtrado ---


            // Lógica de Modales
            function openModal(modalId, videoId) {
                const modal = document.getElementById(modalId);
                if (!modal) return;
                const iframe = modal.querySelector('iframe');
                if (iframe && videoId) iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                modal.classList.add('show');
            }

            function closeModal(modal) {
                if (!modal) return;
                const iframe = modal.querySelector('iframe');
                if (iframe) iframe.src = ""; // Detiene el video al cerrar
                modal.classList.remove('show');
            }
            
            // Lógica del modal de documentos
            const docModal = document.getElementById('document-modal');
            const modalDocTitle = document.getElementById('modal-doc-title');
            const modalDocDescription = document.getElementById('modal-doc-description');
            const modalDocImage = document.getElementById('modal-doc-image');
            const modalDocPrompt = document.getElementById('modal-doc-prompt'); // Este es el PRE
            const copyPromptFromModalBtn = document.getElementById('copy-prompt-from-modal-btn');
            const sendPromptToAssistantBtn = document.getElementById('send-prompt-to-assistant-btn'); // Nuevo botón para enviar

            // Función para mostrar toast de manera genérica
            function showToast(message) {
                toast.textContent = message;
                toast.className = 'show';
                setTimeout(() => { 
                    toast.className = toast.className.replace('show', '');
                    // Reseteamos el texto después de que la animación termine
                    setTimeout(() => { toast.textContent = originalToastText; }, 500); 
                }, 3000);
            }

            // Abrir modal al hacer clic en el botón de "Ver Ejemplo"
            document.querySelectorAll('.open-doc-modal-btn').forEach(button => {
                button.addEventListener('click', function(event) {
                    event.stopPropagation(); 
                    const item = this.closest('.document-item');
                    
                    modalDocTitle.textContent = item.dataset.title;
                    modalDocDescription.textContent = item.dataset.description;
                    modalDocImage.src = item.dataset.imageSrc;
                    // Aseguramos que los saltos de línea del data-prompt se interpreten correctamente en el PRE
                    modalDocPrompt.textContent = item.dataset.prompt.replace(/\\n/g, '\n'); 
                    
                    docModal.classList.add('show');
                });
            });

            // Copiar el prompt desde la modal
            if (copyPromptFromModalBtn) {
                copyPromptFromModalBtn.addEventListener('click', function() {
                    if (modalDocPrompt) {
                        navigator.clipboard.writeText(modalDocPrompt.textContent.trim()).then(() => {
                            showToast('¡Instrucción copiada al portapapeles!');
                        }).catch(err => {
                            console.error('Error al copiar el texto: ', err);
                            showToast('Error al copiar la instrucción.');
                        });
                    }
                });
            }

            // Enviar el prompt al asistente (NotebookLM)
            if (sendPromptToAssistantBtn) {
                sendPromptToAssistantBtn.addEventListener('click', function(event) {
                    event.preventDefault(); // Previene que el enlace navegue a '#'
                    const promptText = modalDocPrompt.textContent; // Obtenemos el texto del PRE
                    
                    // ** IMPORTANTE: VERIFICAR SI NOTEBOOKLM SOPORTA PROMPTS POR URL **
                    // Si NotebookLM permite pasar un prompt inicial en la URL (ej: ?prompt=TU_TEXTO), descomenta y usa esto:
                    // const urlWithPrompt = `${NOTEBOOKLM_CHAT_URL}?prompt=${encodeURIComponent(promptText)}`;
                    // window.open(urlWithPrompt, '_blank');

                    // Si NO permite pasar parámetros, simplemente abre la página y da instrucciones al usuario.
                    window.open(NOTEBOOKLM_CHAT_URL, '_blank');
                    showToast('Se abrió NotebookLM. Pega la instrucción en el chat y presiona enviar.');

                    // Opcional: Cerrar la modal después de abrir la nueva página.
                    closeModal(docModal);
                });
            }

            // Lógica General y Event Listeners
            function goToChat() { window.open(NOTEBOOKLM_CHAT_URL, '_blank'); }
            document.getElementById('summary-card-btn')?.addEventListener('click', () => openModal('summary-video-modal', SUMMARY_YOUTUBE_ID));
            document.getElementById('go-to-assistant-btn')?.addEventListener('click', goToChat);
            document.getElementById('go-to-assistant-from-modal-btn')?.addEventListener('click', goToChat);
            document.getElementById('quick-chat-button')?.addEventListener('click', goToChat);

            document.querySelectorAll('.modal-overlay').forEach(modal => {
                const closeBtn = modal.querySelector('.modal-close-btn');
                if(closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
                modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal); });
            });
            document.addEventListener('keydown', (event) => { if (event.key === "Escape") { const openModal = document.querySelector('.modal-overlay.show'); if(openModal) closeModal(openModal); } });
            
            // Accordion Logic
            document.querySelectorAll('.accordion-header').forEach(header => {
                header.addEventListener('click', function() {
                    const panel = this.nextElementSibling;
                    const isActive = this.classList.contains('active');
                    // Cierra otros accordions si están abiertos
                    document.querySelectorAll('.accordion-header.active').forEach(h => { if (h !== this) { h.classList.remove('active'); h.nextElementSibling.style.maxHeight = null; } });
                    
                    if (!isActive) { 
                        this.classList.add('active'); 
                        panel.style.maxHeight = panel.scrollHeight + "px"; 
                    } else { 
                        this.classList.remove('active'); 
                        panel.style.maxHeight = null; 
                    } 
                });
            });

            // FAQ Click-to-copy
            document.querySelectorAll('.faq-list-nested li').forEach(item => {
                item.addEventListener('click', (event) => {
                    event.stopPropagation();
                    navigator.clipboard.writeText(item.textContent.trim()).then(() => { 
                        showToast('¡Pregunta copiada al portapapeles!'); 
                    });
                });
            });

            // Fade-in sections
            const sections = document.querySelectorAll('.fade-in-section');
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            sections.forEach(section => observer.observe(section));

            // ===== LÓGICA PARA SIMULADOR DE TRÁMITES =====
            const tramiteSelect = document.getElementById('tramite-type');
            const simulationResults = document.getElementById('simulation-results');

            if(tramiteSelect && simulationResults) {
                tramiteSelect.addEventListener('change', function() {
                    const selectedTramite = this.value;
                    let content = '';

                    switch(selectedTramite) {
                        case 'licencia_gravidez':
                            content = `
                                <p class="result-item"><strong>1. Requisito:</strong> Ser trabajadora de base con 6 meses de antigüedad.</p>
                                <p class="result-item"><strong>2. Documento Clave:</strong> Presentar la Licencia Médica expedida por el ISSSTE.</p>
                                <p class="result-item"><strong>3. Duración:</strong> 90 días naturales con goce de sueldo íntegro.</p>
                                <p class="result-item"><strong>4. Proceso:</strong> Entregar la licencia en el área de Recursos Humanos de su adscripción.</p>`;
                            break;
                        case 'estimulo_antiguedad':
                            content = `
                                <p class="result-item"><strong>1. Requisito:</strong> Cumplir 10, 15, 20, 25, 30, 35, 40, 45 o 50 años de servicio efectivo.</p>
                                <p class="result-item"><strong>2. Beneficio:</strong> Se otorga un diploma y un estímulo económico.</p>
                                <p class="result-item"><strong>3. Cálculo del Estímulo:</strong> El monto varía según los años cumplidos (ej. 40 años = Medalla "Maestro Rafael Ramírez" más estímulo).</p>
                                 <p class="result-item"><strong>4. Proceso:</strong> La DGRHO emite la convocatoria y el personal de adscripción postula a los candidatos.</p>`;
                            break;
                        case 'jubilacion':
                            content = `
                               <p class="result-item"><strong>1. Requisito (Edad y Antigüedad):</strong> Varía según el régimen del ISSSTE. Generalmente, se requiere una edad mínima y años de cotización.</p>
                               <p class="result-item"><strong>2. Documentos:</strong> Hoja Única de Servicios, constancia de sueldos, identificación oficial, estado de cuenta del SAR.</p>
                               <p class="result-item"><strong>3. Proceso Inicial:</strong> Acudir al área de Recursos Humanos para solicitar la Hoja Única de Servicios.</p>
                               <p class="result-item"><strong>4. Trámite Final:</strong> Presentar la documentación en la delegación del ISSSTE correspondiente.</p>`;
                            break;
                        default:
                            content = '<p>Selecciona un trámite para ver los pasos y requisitos clave.</p>';
                    }
                    simulationResults.innerHTML = content;
                });
            }
            // ===== FIN DE LA LÓGICA INTERACTIVA =====
        });