import React, { useState, useRef, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const facts = [
  "ООП основано на концепции объектов, которые могут содержать данные и методы для работы с этими данными.",
  "Основные принципы ООП включают инкапсуляцию, наследование, полиморфизм и абстракцию.",
  "Классы в ООП описывают общие характеристики объектов, а объекты являются экземплярами этих классов.",
  "Наследование позволяет одному классу наследовать свойства и методы другого класса.",
  "Инкапсуляция позволяет скрыть внутреннюю реализацию объекта, предоставляя только необходимые методы для взаимодействия с ним.",
  "Полиморфизм позволяет объектам разных типов обрабатывать одинаковые методы по-разному.",
  "Абстракция позволяет скрывать сложность системы, предоставляя пользователям только основные детали работы.",
  "В ООП методы могут быть перегружены, что позволяет использовать одно имя для разных операций, зависимых от типа входных данных.",
  "В ООП объекты могут взаимодействовать друг с другом, вызывая методы, принадлежащие другим объектам.",
  "ООП поддерживает концепцию создания иерархий классов, что позволяет моделировать реальный мир в программном коде.",
  "Интерфейсы и абстрактные классы позволяют создавать общие контракты для различных объектов.",
  "ООП часто используется для создания программ, которые легко расширять и поддерживать.",
  "ООП помогает улучшить повторное использование кода, так как классы и объекты могут быть использованы в разных частях программы.",
  "ООП позволяет разделять функциональность на более мелкие части, что упрощает тестирование и отладку.",
  "В некоторых языках программирования, таких как Java, все является объектом, даже примитивные типы данных.",
  "ООП позволяет моделировать взаимоотношения между объектами, как в реальной жизни, например, через ассоциации, агрегацию и композицию.",
  "С помощью ООП можно создавать гибкие и легко масштабируемые приложения.",
  "ООП помогает делать код более читаемым и понятным, особенно в больших проектах.",
  "ООП помогает предотвратить дублирование кода, так как методы и свойства могут быть переиспользованы в разных классах.",
  "ООП используется во многих популярных языках программирования, таких как Python, Java, C++, C# и других.",
];

export default function LoadingScreen() {
  const [timer, setTimer] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [factNumber, setFactNumber] = useState(
    Math.floor(Math.random() * facts.length)
  );
  const loading = useRef(false);
  const [loadingText, setLoadingText] = useState(
    "Сократи ожидание с помощью этого интересного факта об ООП:"
  );
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 0.1);
      if (timer > 0.5) {
        loading.current = true;
      }
      if (timer > 3) {
        setShowFact(true);
      }
      if (timer > 30) {
        setLoadingText(
          "Если F5 не помогает, пожалуйста, свяжитесь со мной в Telegram @atoxxia."
        );
      }
    }, 100);
    return () => clearInterval(interval);
  }, [timer]);
  
  return (
    <div className="flex grow justify-center items-center bg-slate-900 text-white/50">
      {showFact === true ? (
        <div className="absolute top-[30%] text-base text-white/70">
          <div className="text-sm mb-1 text-center">{loadingText}</div>
          <div className="mt-1 mb-3 text-white/80">{facts[factNumber]}</div>
          <div className="flex justify-center items-center">
            <button
              className="border rounded p-1 py-0.5 text-sm opacity-60 border-slate-400/80 hover:opacity-100"
              onClick={() => {
                setFactNumber(
                  factNumber === facts.length - 1 ? 0 : factNumber + 1
                );
              }}
            >
              Хочу следующий факт
            </button>
          </div>
        </div>
      ) : null}
      {loading.current ? (
        <AiOutlineLoading size={120} className="sm:mr-5 mr-1 animate-spin" />
      ) : null}
    </div>
  );
}
