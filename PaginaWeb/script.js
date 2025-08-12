 document.addEventListener('DOMContentLoaded', function() {
         
            const NOTEBOOKLM_CHAT_URL = "https://notebooklm.google.com/notebook/a07b0d8e-2f0e-4efe-b084-fd2fbf685fc1?authuser=1";
            const SUMMARY_YOUTUBE_ID = "Xv5ZrnzA2DA"; 
            const toast = document.getElementById('toast-notification');
            const originalToastText = '¡Requisitos copiados al portapapeles!'; 
            if(toast) toast.textContent = originalToastText;

 
            function openModal(modalId, videoId) {
                const modal = document.getElementById(modalId);
                if (!modal) return;
                const iframe = modal.querySelector('iframe');
               
                if (iframe && videoId) iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`; 
                modal.classList.add('show');
            }

            function closeModal(modal) {
                if (!modal) return;
                const iframe = modal.querySelector('iframe');
           
                if (iframe) iframe.src = ""; 
                modal.classList.remove('show');
            }
            
            const docModal = document.getElementById('document-modal');
            const modalDocNameLeft = document.getElementById('modal-doc-name-left');
            const modalDocDescriptionLeft = document.getElementById('modal-doc-description-left');
            const modalDocRequirements = document.getElementById('modal-doc-requirements');
            const goToAssistantFromDocModalBtn = document.getElementById('go-to-assistant-from-doc-modal-btn'); 

            function showToast(message) {
                if(toast) {
                    toast.textContent = message;
                    toast.className = 'show'; 
                    setTimeout(() => { 
                        toast.className = toast.className.replace('show', '');
                        setTimeout(() => { if(toast) toast.textContent = originalToastText; }, 500); 
                    }, 3000);
                }
            }

            document.querySelectorAll('.open-doc-modal-btn').forEach(button => {
                button.addEventListener('click', function(event) {
                    event.stopPropagation(); 
                    const item = this; 
                    
                    if (modalDocNameLeft) modalDocNameLeft.textContent = item.dataset.docName;
                    if (modalDocDescriptionLeft) modalDocDescriptionLeft.textContent = item.dataset.docDescription;
                    if (modalDocRequirements) modalDocRequirements.innerHTML = item.dataset.requirements; 
                    
                    docModal.classList.add('show'); 
                });
            });


            if (goToAssistantFromDocModalBtn) {
                goToAssistantFromDocModalBtn.addEventListener('click', function() {
                    goToChat(); 
                });
            }

            function goToChat() { window.open(NOTEBOOKLM_CHAT_URL, '_blank'); }
            document.getElementById('go-to-assistant-btn')?.addEventListener('click', goToChat); 
            document.getElementById('go-to-assistant-from-modal-btn')?.addEventListener('click', goToChat); 
            document.getElementById('quick-chat-button')?.addEventListener('click', goToChat); 

            document.querySelectorAll('.modal-overlay').forEach(modal => {
                const closeBtn = modal.querySelector('.modal-close-btn');
                if(closeBtn) closeBtn.addEventListener('click', () => closeModal(modal)); 
                modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal); }); 
            });
            document.addEventListener('keydown', (event) => { 
                if (event.key === "Escape") { 
                    const openModal = document.querySelector('.modal-overlay.show'); 
                    if(openModal) closeModal(openModal); 
                } 
            });

        
            const toggleButton = document.getElementById('toggle-sections-btn');
            const sectionsToToggleWrapper = document.getElementById('sections-to-toggle-wrapper'); 
            const toggleIcon = toggleButton?.querySelector('i'); 

            if (toggleButton && sectionsToToggleWrapper && toggleIcon) {
                toggleButton.addEventListener('click', function(event) {
                    event.preventDefault(); 
                    const isHidden = sectionsToToggleWrapper.classList.contains('hidden-content');

                    if (isHidden) {
                        sectionsToToggleWrapper.classList.remove('hidden-content');
                        sectionsToToggleWrapper.classList.add('visible-content');
                        toggleIcon.classList.remove('fa-chevron-down');
                        toggleIcon.classList.add('fa-chevron-up');
                        toggleButton.textContent = ' Ocultar Secciones';
                        toggleButton.prepend(toggleIcon); 
                    } else {
                        sectionsToToggleWrapper.classList.remove('visible-content');
                        sectionsToToggleWrapper.classList.add('hidden-content');
                        toggleIcon.classList.remove('fa-chevron-up');
                        toggleIcon.classList.add('fa-chevron-down');
                        toggleButton.textContent = ' Ver Opciones y Ayuda';
                        toggleButton.prepend(toggleIcon); 
                    }
                });
            }
            
            document.querySelectorAll('.accordion-header').forEach(header => {
                header.addEventListener('click', function() {
                    const panel = this.nextElementSibling;
                    const isActive = this.classList.contains('active');
                
                    document.querySelectorAll('.accordion-header.active').forEach(h => { 
                        if (h !== this) { 
                            h.classList.remove('active'); 
                            h.nextElementSibling.style.maxHeight = null; 
                        } 
                    });
                    
                    if (!isActive) { 
                        this.classList.add('active'); 
                        panel.style.maxHeight = panel.scrollHeight + "px"; 
                    } else { 
                        this.classList.remove('active'); 
                        panel.style.maxHeight = null; 
                    } 
                });
            });

    
            document.querySelectorAll('.faq-list-nested li').forEach(item => {
                item.addEventListener('click', (event) => {
                    event.stopPropagation(); 
                    navigator.clipboard.writeText(item.textContent.trim()).then(() => { 
                        showToast('¡Pregunta copiada al portapapeles!'); 
                    });
                });
            });

            const fadeSections = document.querySelectorAll('.fade-in-section');
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); 
                    }
                });
            }, { threshold: 0.1 }); 
            fadeSections.forEach(section => observer.observe(section));

            const tramiteSelect = document.getElementById('tramite-type');
            const simulationResults = document.getElementById('simulation-results');
            if(tramiteSelect && simulationResults) {
                tramiteSelect.addEventListener('change', function() {
                    const selectedTramite = this.value;
                    let content = '';
                    switch(selectedTramite) {
                        case 'licencia_gravidez': 
                            content = `<p class="result-item"><strong>1. Requisito:</strong> Ser trabajadora de base con 6 meses de antigüedad.</p><p class="result-item"><strong>2. Documento Clave:</strong> Presentar la Licencia Médica expedida por el ISSSTE.</p><p class="result-item"><strong>3. Duración:</strong> 90 días naturales con goce de sueldo íntegro.</p><p class="result-item"><strong>4. Proceso:</strong> Entregar la licencia en el área de Recursos Humanos de su adscripción.</p>`; 
                            break;
                        case 'estimulo_antiguedad': 
                            content = `<p class="result-item"><strong>1. Requisito:</strong> Cumplir 10, 15, 20, 25, 30, 35, 40, 45 o 50 años de servicio efectivo.</p><p class="result-item"><strong>2. Beneficio:</strong> Se otorga un diploma y un estímulo económico.</p><p class="result-item"><strong>3. Cálculo del Estímulo:</strong> El monto varía según los años cumplidos (ej. 40 años = Medalla "Maestro Rafael Ramírez" más estímulo).</p><p class="result-item"><strong>4. Proceso:</strong> La DGRHO emite la convocatoria y el personal de adscripción postula a los candidatos.</p>`; 
                            break;
                        case 'jubilacion': 
                            content = `<p class="result-item"><strong>1. Requisito (Edad y Antigüedad):</strong> Varía según el régimen del ISSSTE. Generalmente, se requiere una edad mínima y años de cotización.</p><p class="result-item"><strong>2. Documentos:</strong> Hoja Única de Servicios, constancia de sueldos, identificación oficial, estado de cuenta del SAR.</p><p class="result-item"><strong>3. Proceso Inicial:</strong> Acudir al área de Recursos Humanos para solicitar la Hoja Única de Servicios.</p><p class="result-item"><strong>4. Trámite Final:</strong> Presentar la documentación en la delegación del ISSSTE correspondiente.</p>`; 
                            break;
                        default: 
                            content = '<p>Selecciona un trámite para ver los pasos y requisitos clave.</p>';
                    }
                    simulationResults.innerHTML = content; 
                });
            }

            document.getElementById('summary-card-btn')?.addEventListener('click', () => openModal('summary-video-modal', SUMMARY_YOUTUBE_ID));

        }); 
        document.getElementById('glossary-search').addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            document.querySelectorAll('.glossary-list dt, .glossary-list dd').forEach(element => {
                const parentItem = element.closest('dd') ? element.closest('dd').previousElementSibling : element; 
                const fullText = (parentItem.textContent + (parentItem.nextElementSibling ? parentItem.nextElementSibling.textContent : '')).toLowerCase();
                
                if (fullText.includes(searchTerm)) {
                    element.style.display = 'block';
                    if (element.tagName === 'DT') { 
                        if (element.nextElementSibling && element.nextElementSibling.tagName === 'DD') {
                            element.nextElementSibling.style.display = 'block';
                        }
                    } else if (element.tagName === 'DD') { 
                         if (element.previousElementSibling && element.previousElementSibling.tagName === 'DT') {
                            element.previousElementSibling.style.display = 'block';
                        }
                    }
                } else {
                    element.style.display = 'none'; 
                }
            });
           
            document.querySelectorAll('.accordion-item').forEach(accordionItem => {
                const glossaryTerms = accordionItem.querySelectorAll('.glossary-list dt, .glossary-list dd');
                let hasVisibleTerms = false;
                glossaryTerms.forEach(term => {
                    if (term.style.display !== 'none') {
                        hasVisibleTerms = true;
                    }
                });

                const accordionHeader = accordionItem.querySelector('.accordion-header');
                if (hasVisibleTerms) {
                    accordionItem.style.display = 'block';
                } else {
                    accordionItem.style.display = 'none';
                }
            });
        });