
import * as XLSX from 'xlsx';
import { RenovationProject, EstimateItem } from '../types.ts';

export const exportToExcel = (project: RenovationProject) => {
  // Используем ту же логику сортировки категорий, что и в компоненте EstimateTable
  const categories = Array.from(new Set(project.items.map(item => item.category))).sort((a, b) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b);
  });
  
  const rows: any[] = [];
  
  // Заголовок проекта
  rows.push([project.name]);
  rows.push([`Дата экспорта: ${new Date().toLocaleDateString()}`]);
  rows.push([]); // Пустая строка

  let grandTotal = 0;

  categories.forEach(category => {
    const categoryItems = project.items.filter(i => i.category === category);
    const categoryTotal = categoryItems.reduce((sum, i) => sum + (i.quantity * i.pricePerUnit), 0);
    grandTotal += categoryTotal;

    // Заголовок категории
    rows.push([category.toUpperCase()]);
    // Шапка таблицы
    rows.push(['Наименование', 'Ед.изм.', 'Кол-во', 'Цена (₽)', 'Сумма (₽)']);
    
    categoryItems.forEach(item => {
      rows.push([
        item.name,
        item.unit,
        item.quantity,
        item.pricePerUnit,
        item.quantity * item.pricePerUnit
      ]);
    });

    // Итог по категории
    rows.push(['', '', '', 'Итого по разделу:', categoryTotal]);
    rows.push([]); // Пустая строка
  });

  rows.push(['', '', '', 'ОБЩИЙ ИТОГ СМЕТЫ:', grandTotal]);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  
  // Настройка ширины колонок
  worksheet['!cols'] = [
    { wch: 50 }, // Наименование
    { wch: 10 }, // Ед.изм.
    { wch: 10 }, // Кол-во
    { wch: 15 }, // Цена
    { wch: 15 }, // Сумма
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Смета');
  
  XLSX.writeFile(workbook, `${project.name.replace(/[/\\?%*:|"<>]/g, '-')}.xlsx`);
};
