import { useMemo, useState } from 'react'
import moment from 'moment'
moment.locale('es')
export default function CrearPeriodo({ add, salir, periodos }) {

    const [nombre, setNombre] = useState("")
    const [inicio, setInicio] = useState("")
    const [final, setFinal] = useState("")
    const [color, setColor] = useState("")
    const [repetir, setRepetir] = useState([])

    const horas = useMemo(() => {
        if (inicio && final) {
            let [hoursa, minsa] = inicio.split(":").map(Number);
            let [hoursb, minsb] = final.split(":").map(Number);
            if (!isNaN(hoursa) && !isNaN(minsa) && !isNaN(hoursb) && !isNaN(minsb)) {
                let start = moment().hours(hoursa).minutes(minsa);
                let end = moment().hours(hoursb).minutes(minsb);
                if (end.isBefore(start)) {
                    end.add(1, 'day');
                }
                return moment.duration(end.diff(start)).asHours();
            }
        }
        return 0;
    }, [inicio, final]);

    const guardar = () => {
        add({
            nombre: nombre,
            inicio: inicio,
            final: final,
            horas: horas,
            color: color,
            repetir: repetir
        })
        setNombre("")
        setInicio("")
        setFinal("")
        setColor("")
        setRepetir([])
        salir()
    }
    return (
        <form className='flex px-4' onSubmit={guardar}>
            <div className='flex w-full gap-4 justify-between items-stretch'>
                <div className='flex flex-col'>
                    <label>Nombre</label>
                    <input className='inpt' placeholder='Nombre' required autoFocus
                        id="nombre" name="nombre" type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div className='flex flex-col'>
                    <label>Desde:</label>
                    <input className='inpt' name="inicio" required
                        type='time' value={inicio} onChange={(e) => setInicio(e.target.value)} />
                </div>
                <div className='flex flex-col'>
                    <label>Hasta:</label>
                    <input className='inpt' name="final" required
                        type='time' value={final} onChange={(e) => setFinal(e.target.value)} />
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Color:</label>
                    <input name="color" type='color' required
                        value={color} onChange={(e) => setColor(e.target.value)} />
                </div>
                <div className='flex gap-2 items-center'>
                    <button type='button' className='btn_cncl' onClick={salir} >salir</button>
                    <button type='button' className='btn' onClick={guardar} >guardar</button>
                </div>
            </div>
        </form>
    )
}
