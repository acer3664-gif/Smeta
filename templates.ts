
import { EstimateItem } from '../types.ts';

export interface EstimateTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: Omit<EstimateItem, 'id'>[];
}

export const ESTIMATE_TEMPLATES: EstimateTemplate[] = [
  {
    id: 'pro-template',
    name: 'Профессиональный стандарт 2024',
    description: 'Детальная смета по вашему списку работ.',
    icon: 'Hammer',
    items: [
      // 1. Черновые работы
      { category: '1. Черновые работы', name: 'Демонтаж, уборка, вынос мусора', unit: 'м2', quantity: 0, pricePerUnit: 27000 },
      { category: '1. Черновые работы', name: 'Подготовка объекта к работам', unit: 'шт', quantity: 0, pricePerUnit: 13500 },
      { category: '1. Черновые работы', name: 'Гидро, шумоизоляция пола', unit: 'м2', quantity: 0, pricePerUnit: 945 },
      { category: '1. Черновые работы', name: 'Разметка помещений', unit: 'шт', quantity: 0, pricePerUnit: 6750 },
      { category: '1. Черновые работы', name: 'Кладка перегородок', unit: 'м2', quantity: 0, pricePerUnit: 1755 },
      { category: '1. Черновые работы', name: 'Устройство проемов', unit: 'шт', quantity: 0, pricePerUnit: 4050 },
      { category: '1. Черновые работы', name: 'Шумоизоляция стояков', unit: 'шт', quantity: 0, pricePerUnit: 6750 },

      // 2. Электрика
      { category: '2. Электрика', name: 'точки электро', unit: 'шт', quantity: 0, pricePerUnit: 540 },
      { category: '2. Электрика', name: 'точки короновка', unit: 'шт', quantity: 0, pricePerUnit: 810 },
      { category: '2. Электрика', name: 'Пересборка щита (Д)', unit: 'шт', quantity: 0, pricePerUnit: 10800 },
      { category: '2. Электрика', name: 'коробки распаячные', unit: 'шт', quantity: 0, pricePerUnit: 945 },
      { category: '2. Электрика', name: 'гофра прокладка', unit: 'м/п', quantity: 0, pricePerUnit: 135 },
      { category: '2. Электрика', name: 'Теплый пол устройство', unit: 'шт', quantity: 0, pricePerUnit: 10800 },
      { category: '2. Электрика', name: 'Установка роз и вык', unit: 'шт', quantity: 0, pricePerUnit: 540 },
      { category: '2. Электрика', name: 'Установка люстр, бр', unit: 'шт', quantity: 0, pricePerUnit: 1620 },
      { category: '2. Электрика', name: 'Монтаж ленты свет', unit: 'м/п', quantity: 0, pricePerUnit: 1350 },
      { category: '2. Электрика', name: 'Разное', unit: 'шт', quantity: 0, pricePerUnit: 13500 },
      { category: '2. Электрика', name: 'Штроба', unit: 'м/п', quantity: 0, pricePerUnit: 810 },
      { category: '2. Электрика', name: 'Установка карнизов', unit: 'шт', quantity: 0, pricePerUnit: 0 },

      // 3. Отопление
      { category: '3. Отопление', name: 'установка радиаторов', unit: 'шт', quantity: 0, pricePerUnit: 4050 },
      { category: '3. Отопление', name: 'установка конвекторов', unit: 'шт', quantity: 0, pricePerUnit: 6750 },
      { category: '3. Отопление', name: 'Щиток + гребенка', unit: 'шт', quantity: 0, pricePerUnit: 13500 },
      { category: '3. Отопление', name: 'Коллектор (ветка)', unit: 'ветка', quantity: 0, pricePerUnit: 8100 },
      { category: '3. Отопление', name: 'Система водоотведения', unit: 'точка', quantity: 0, pricePerUnit: 3375 },
      { category: '3. Отопление', name: 'Штробы', unit: 'м/п', quantity: 0, pricePerUnit: 1350 },

      // 4. Водоснабжение
      { category: '4. Водоснабжение', name: 'Подвода воды', unit: 'точка', quantity: 0, pricePerUnit: 4725 },
      { category: '4. Водоснабжение', name: 'Защита от протечек, нептун', unit: 'шт', quantity: 0, pricePerUnit: 10800 },
      { category: '4. Водоснабжение', name: 'Коллекторный узел (груб фильтр)', unit: 'шт', quantity: 0, pricePerUnit: 20250 },
      { category: '4. Водоснабжение', name: 'Водонагреватель установка', unit: 'шт', quantity: 0, pricePerUnit: 6750 },
      { category: '4. Водоснабжение', name: 'Инсталляция установка', unit: 'шт', quantity: 0, pricePerUnit: 10800 },
      { category: '4. Водоснабжение', name: 'Установка смесителей душ, раковина', unit: 'шт', quantity: 0, pricePerUnit: 47250 },
      { category: '4. Водоснабжение', name: 'Установка унитаза и кнопки', unit: 'шт', quantity: 0, pricePerUnit: 6750 },
      { category: '4. Водоснабжение', name: 'Установка принадлежностей', unit: 'шт', quantity: 0, pricePerUnit: 6750 },

      // 5. Штукатурные работы
      { category: '5. Штукатурные работы', name: 'стены', unit: 'м2', quantity: 0, pricePerUnit: 1012.5 },
      { category: '5. Штукатурные работы', name: 'откосы', unit: 'м/п', quantity: 0, pricePerUnit: 1350 },
      { category: '5. Штукатурные работы', name: 'углы под 90', unit: 'м/п', quantity: 0, pricePerUnit: 607.5 },

      // 6. Стяжка пола
      { category: '6. Стяжка пола', name: 'стяжка', unit: 'м/п', quantity: 0, pricePerUnit: 945 },
      { category: '6. Стяжка пола', name: 'фибра', unit: 'шт', quantity: 0, pricePerUnit: 6750 },
      { category: '6. Стяжка пола', name: 'укрытие пленкой/проклейка', unit: 'м2', quantity: 0, pricePerUnit: 270 },
      { category: '6. Стяжка пола', name: 'Срез демпфера, уборка', unit: 'шт', quantity: 0, pricePerUnit: 9450 },

      // 7. Гипсокартон
      { category: '7. Гипсокартон', name: 'Короба инсталляции', unit: 'шт', quantity: 0, pricePerUnit: 10800 },
      { category: '7. Гипсокартон', name: 'Перегородки', unit: 'м2', quantity: 0, pricePerUnit: 1620 },
      { category: '7. Гипсокартон', name: 'Потолки', unit: 'м2', quantity: 0, pricePerUnit: 3375 },
      { category: '7. Гипсокартон', name: 'Ниши', unit: 'м/п', quantity: 0, pricePerUnit: 3375 },
      { category: '7. Гипсокартон', name: 'Закладные под мебель', unit: 'м/п', quantity: 0, pricePerUnit: 1000 },
      { category: '7. Гипсокартон', name: 'Установка лючка скрытого', unit: 'шт', quantity: 0, pricePerUnit: 6075 },

      // 8. Плитка 60*120
      { category: '8. Плитка 60*120', name: 'Укладка', unit: 'м2', quantity: 0, pricePerUnit: 4725 },
      { category: '8. Плитка 60*120', name: 'Запил углов', unit: 'м/п', quantity: 0, pricePerUnit: 1350 },
      { category: '8. Плитка 60*120', name: 'Затирка цементная', unit: 'м2', quantity: 0, pricePerUnit: 675 },
      { category: '8. Плитка 60*120', name: 'Отверстия', unit: 'шт', quantity: 0, pricePerUnit: 945 },
      { category: '8. Плитка 60*120', name: 'Ниши, короба', unit: 'шт', quantity: 0, pricePerUnit: 27000 },
      { category: '8. Плитка 60*120', name: 'Устройство ванны/трапа', unit: 'шт', quantity: 0, pricePerUnit: 13500 },
      { category: '8. Плитка 60*120', name: 'Гидроизоляция пола', unit: 'м2', quantity: 0, pricePerUnit: 675 },
      { category: '8. Плитка 60*120', name: 'Кухонный фартук', unit: 'м/п', quantity: 0, pricePerUnit: 6750 },

      // 9. Укладка напольного покрытия
      { category: '9. Укладка напольного покрытия', name: 'Ламинат', unit: 'м2', quantity: 0, pricePerUnit: 675 },
      { category: '9. Укладка напольного покрытия', name: 'Плинтус полиуретан', unit: 'м/п', quantity: 0, pricePerUnit: 1620 },
      { category: '9. Укладка напольного покрытия', name: 'Теневой плинтус', unit: 'м/п', quantity: 0, pricePerUnit: 4050 },
      { category: '9. Укладка напольного покрытия', name: 'Пороги и стыки', unit: 'м/п', quantity: 0, pricePerUnit: 810 },

      // 10. Малярные работы
      { category: '10. Малярные работы', name: 'Потолок', unit: 'м2', quantity: 0, pricePerUnit: 2700 },
      { category: '10. Малярные работы', name: 'Стены', unit: 'м2', quantity: 0, pricePerUnit: 2160 },
      { category: '10. Малярные работы', name: 'Потолочные багеты', unit: 'м/п', quantity: 0, pricePerUnit: 2700 },
      { category: '10. Малярные работы', name: 'Молдинги', unit: 'м/п', quantity: 0, pricePerUnit: 2025 },
      { category: '10. Малярные работы', name: 'Укрытие стен и др.', unit: 'шт', quantity: 0, pricePerUnit: 10800 },

      // Итоги
      { category: 'Итоги', name: 'Уборка перед сдачей', unit: 'шт', quantity: 0, pricePerUnit: 13500 },
      { category: 'Итоги', name: 'Установка межкомнатных дверей', unit: 'шт', quantity: 0, pricePerUnit: 12150 },
      { category: 'Итоги', name: 'Неучтенные работы', unit: 'шт', quantity: 0, pricePerUnit: 33750 },
    ]
  }
];

export const STANDARD_TEMPLATE = ESTIMATE_TEMPLATES[0].items;
