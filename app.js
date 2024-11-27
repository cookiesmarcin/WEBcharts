document.addEventListener('DOMContentLoaded', () => {
    const viewSection = document.getElementById('viewSection'); // Główna sekcja z kafelkami
    const chartIcons = document.querySelectorAll('.chart-icon'); // Ikony w PANELU KAFELKÓW
    const slideOutPanel = document.getElementById('slideOutPanel'); // PANEL SZCZEGÓŁÓW
    const sideMenu = document.querySelector('.side-menu'); // PANEL KAFELKÓW
    const collapsedMenu = document.createElement('div'); // Pasek wysuwania dla PANELU KAFELKÓW

    // Dodanie paska wysuwania do strony
    collapsedMenu.className = 'collapsed-menu';
    collapsedMenu.innerHTML = `<button class="open-menu-button">▶</button>`;
    document.body.appendChild(collapsedMenu);
    collapsedMenu.style.display = 'none'; // Ukrycie belki na starcie

    // Funkcja do dynamicznego dodawania wykresu
    chartIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const chart = document.createElement('div');
            chart.className = 'chart level-1';
            chart.innerHTML = `
                <button class="close-button">X</button>
                <div class="chart-header">
                    Wykres poziom 1
                    <select class="level-selector">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Godzina</th>
                            <th>Liczba</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Array.from({ length: 8 }, (_, i) => `
                            <tr>
                                <td>${String(i + 6).padStart(2, '0')}:00</td>
                                <td contenteditable="true"></td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            `;
            viewSection.appendChild(chart);
            icon.style.display = 'none'; // Ukrycie ikony po dodaniu wykresu

            // Obsługa zamykania kafelka
            chart.querySelector('.close-button').addEventListener('click', () => {
                viewSection.removeChild(chart);
                icon.style.display = 'block';
            });

            // Obsługa zmiany rozmiaru kafelka
            chart.querySelector('.level-selector').addEventListener('change', (event) => {
                const newLevel = event.target.value;
                chart.className = `chart level-${newLevel}`;
            });
        });
    });

    // Obsługa zamykania PANELU SZCZEGÓŁÓW
    slideOutPanel.addEventListener('click', (event) => {
        if (event.target.id === 'closePanelButton') {
            slideOutPanel.classList.remove('open');
        }
    });

    // Obsługa otwierania PANELU SZCZEGÓŁÓW po kliknięciu w kafelek
    viewSection.addEventListener('click', (event) => {
        const chart = event.target.closest('.chart');
        if (chart) {
            const title = chart.querySelector('.chart-header').innerText.trim();
            const tableData = Array.from(chart.querySelectorAll('.data-table tbody tr')).map(row => {
                return Array.from(row.cells).map(cell => cell.innerText.trim());
            });

            slideOutPanel.innerHTML = `
                <button class="close-panel-button" id="closePanelButton">X</button>
                <h3>Szczegóły: ${title}</h3>
                <h4>Poziom kafelka: ${chart.className.match(/level-\d/)[0]}</h4>
                <h4>Dane z tabeli:</h4>
                <table>
                    ${tableData.map(row => `
                        <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                    `).join('')}
                </table>
            `;
            slideOutPanel.classList.add('open');
        }
    });

    // Obsługa przycisku zamykania PANELU KAFELKÓW
    const closeSideMenuButton = document.createElement('button');
    closeSideMenuButton.className = 'close-side-menu';
    closeSideMenuButton.innerText = 'X';
    sideMenu.prepend(closeSideMenuButton);

    closeSideMenuButton.addEventListener('click', () => {
        sideMenu.classList.add('hidden');
        collapsedMenu.style.display = 'flex'; // Pokazuje belkę wysuwania
        // Ustawienie stałej szerokości dla głównej sekcji
        viewSection.style.maxWidth = '100%';
    });

    // Obsługa przycisku otwierania PANELU KAFELKÓW
    collapsedMenu.querySelector('.open-menu-button').addEventListener('click', () => {
        sideMenu.classList.remove('hidden');
        collapsedMenu.style.display = 'none'; // Ukrywa belkę wysuwania
        // Przywrócenie szerokości głównej sekcji
        viewSection.style.maxWidth = 'calc(100% - 250px)';
    });

    // Funkcja do aktualizacji rozmiaru kafelka
    function updateChartSize(chart, level) {
        chart.classList.remove('level-1', 'level-2', 'level-3');
        chart.classList.add(`level-${level}`);
    }
});
