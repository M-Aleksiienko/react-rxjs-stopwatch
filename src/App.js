import React, {useEffect, useState} from "react";
import './App.css';
import {interval, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";


function App() {
    const [sw, startSW] = useState(false); //SW - StopWatch; в начале секундомер - "выключен"
    const [time, setTime] = useState(0); //начало отсчета c 0
    const [btnText, setBtnText] = useState('Start'); //состояние первой кнопки
    let timer; //таймер, который следит за двойным нажатием

    useEffect(() => {
        !sw ? setBtnText('Start') : setBtnText('Stop'); //процесс смены текста у первой кнопки

        const unsub$ = new Subject();
        // Создаем Observable, которая будет публиковать значение с определенным интервалом
        interval(1000) //в моем случае - 1 секунда
            .pipe(takeUntil(unsub$)) //pipe - метод класса Observable
            .subscribe(() => {
                if (sw) {
                    setTime(val => val + 1);
                }
            });
        return () => {
            unsub$.next();
            unsub$.complete(); //завершение
        };
    }, [sw]);

    //запуск таймера
    const actionStart = () => {
        startSW(prevState => !prevState);
        if (btnText === 'Stop') {
            setTime(0);
        }
    }

    //рестарт таймера
    const actionReset = () => {
        startSW(true);
        setTime(0);
    }

    //отложение таймера с двойным кликом
      const actionWait = event => {
          clearTimeout(timer);
          if (event.detail === 1) { //один клик
            timer = setTimeout(() => {
              console.log("Too Slow!");
            }, 300) // 300 мс
          }
          if (event.detail === 2) { //два клика
              startSW(false);
          }
      }


    return (
        <div className="App">
            <header className="App-header">
                <h1>Stopwatch</h1>
                <div className='sw-container'>
                    <span>{('0' + Math.floor((time / 3600) % 100)).slice(-2)} :</span> {/* часы */}
                    <span>{('0' + Math.floor((time / 60) % 60)).slice(-2)} :</span> {/* минуты */}
                    <span>{('0' + Math.floor(time % 60)).slice(-2)}</span> {/* секунды */}
                </div>
                <div className='btn-container'>
                        <button onClick={actionStart} className='btn'>{btnText}</button>{/* Start/Stop */}
                        <button onClick={actionWait} className='btn'>Wait</button>
                        <button onClick={actionReset} className='btn'>Reset</button>
                </div>
            </header>
        </div>
    );
}

export default App;
