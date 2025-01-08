const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const USERNAME = "USER";
  const PASSWORD = "PASS";
  const BASE_URL = "https://umas.ipss.cl";

  const browser = await puppeteer.launch({ headless: true });

  let pages = await browser.pages();
  if (pages.length > 0) {
    await pages[0].close();
  }

  const page = await browser.newPage();

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    console.log("Accediendo a la página de inicio...");
    await page.goto(`${BASE_URL}/Estudiantes/Login`, { waitUntil: 'networkidle2' });
    await sleep(5000);

    console.log("Esperando el botón de Microsoft...");
    const microsoftButtonSelector = '#btn-office';
    await page.waitForSelector(microsoftButtonSelector, { visible: true, timeout: 30000 });
    await page.click(microsoftButtonSelector);
    await sleep(5000);

    pages = await browser.pages();
    const popupPage = pages[pages.length - 1];
    await popupPage.bringToFront();

    console.log("Introduciendo email...");
    await popupPage.waitForSelector('#i0116', { visible: true, timeout: 20000 });
    await popupPage.type('#i0116', USERNAME);
    await popupPage.keyboard.press('Enter');
    await sleep(5000);

    console.log("Introduciendo contraseña...");
    await popupPage.waitForSelector('#i0118', { visible: true, timeout: 20000 });
    await popupPage.type('#i0118', PASSWORD);
    await popupPage.keyboard.press('Enter');
    await sleep(5000);

    console.log("Confirmando sesión iniciada...");
    try {
      await popupPage.waitForSelector('#idBtn_Back', { visible: true, timeout: 10000 });
      console.log("Clic en 'No'...");
      await popupPage.click('#idBtn_Back');
    } catch (error) {
      console.log("El botón 'No' no se encontró o no está disponible. Continuando...");
    }
    await sleep(5000);

    console.log("Extrayendo nombre del usuario...");
    await page.goto(`${BASE_URL}/Estudiantes/consultas/concentracion-de-notas`, { waitUntil: 'networkidle2' });
    const userName = await page.evaluate(() => {
      const nameElement = document.querySelector('.user-name span');
      if (nameElement) {
        const name = nameElement.innerText.trim().split(' ')[0]; // Toma solo el primer valor
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(); // Capitaliza la primera letra
      }
      return 'nombre-desconocido';
    });

    console.log(`Nombre del usuario extraído: ${userName}`);
    await sleep(5000);

    console.log("Extrayendo datos...");
    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(cell =>
          cell.innerText.trim().replace(/\s+/g, ' ') // Limpia espacios excesivos
        );
        return cells.filter(cell => cell); // Excluye celdas vacías
      }).filter(row => row.length); // Excluye filas vacías
    });

    // console.log("Datos extraídos:", data);

    const csvData = data.map(row => row.join(',')).join('\n');
    const header = "Scraping Notas Web \n";
    const fileName = `${userName}-notas.csv`;

    fs.writeFileSync(fileName, header + csvData, 'utf8');
    console.log(`Datos guardados en '${fileName}'.`);
  } catch (error) {
    console.error("Error durante el proceso:", error);
  } finally {
    await browser.close();
  }
})();