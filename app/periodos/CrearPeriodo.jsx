import { useMemo, useState } from 'react'
import moment from 'moment'
import { usePeriodos } from '@/contextos/periodosContext'
import { useAuth } from '@/contextos/authContext'
moment.locale('es')
export default function CrearPeriodo({ salir }) {
    const {user} = useAuth()
    const {createPeriodo, currentPeriodo, setCurrentPeriodo} = usePeriodos()
    // const [nombre, setNombre] = useState("")
    // const [inicio, setInicio] = useState("")
    // const [final, setFinal] = useState("")
    // const [color, setColor] = useState("")
    // const [repetir, setRepetir] = useState([])

    const horas = useMemo(() => {
        if (currentPeriodo?.horaInicio && currentPeriodo?.horaFin) {
            let [hoursa, minsa] = currentPeriodo.horaInicio.split(":").map(Number);
            let [hoursb, minsb] = currentPeriodo.horaFin.split(":").map(Number);
            if (!isNaN(hoursa) && !isNaN(minsa) && !isNaN(hoursb) && !isNaN(minsb)) {
                let start = moment().hours(hoursa).minutes(minsa);
                let end = moment().hours(hoursb).minutes(minsb);
                if (end.isBefore(start)) {
                    end.add(1, 'day');
                }
                setCurrentPeriodo({...currentPeriodo, horas: moment.duration(end.diff(start)).asHours()});
                return moment.duration(end.diff(start)).asHours()
            }
        }
        return 0;
    }, [currentPeriodo?.horaInicio, currentPeriodo?.horaFin]);

    const guardar = () => {
        createPeriodo(user.database, currentPeriodo);
        setCurrentPeriodo(null);
        salir()
    }
    return (
        <form className='flex px-4 justify-center items-center' onSubmit={guardar}>
            <div className='flex w-full gap-4 justify-center items-center'>
                <div className='flex flex-col'>
                    <label>Nombre</label>
                    <input className='inpt' required autoFocus
                        id="nombre" name="nombre" type='text' value={currentPeriodo?.nombre} onChange={(e) => setCurrentPeriodo({...currentPeriodo, nombre: e.target.value})} />
                </div>
                <div className='flex flex-col'>
                    <label>Desde:</label>
                    <input className='inpt' name="horaInicio" required
                        type='time' value={currentPeriodo?.horaInicio} onChange={(e) => setCurrentPeriodo({...currentPeriodo, horaInicio: e.target.value})} />
                </div>
                <div className='flex flex-col'>
                    <label>Hasta:</label>
                    <input className='inpt' name="horaFin" required
                        type='time' value={currentPeriodo?.horaFin} onChange={(e) => setCurrentPeriodo({...currentPeriodo, horaFin: e.target.value})} />
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Color:</label>
                    <input name="color" type='color' required
                        value={currentPeriodo?.color} onChange={(e) => setCurrentPeriodo({...currentPeriodo, color: e.target.value})} />
                </div>
                <div className='flex gap-2'>
                    <button type='button' className='btn_cncl' onClick={salir} >salir</button>
                    <button type='button' className='btn' onClick={guardar} >guardar</button>
                </div>
            </div>
        </form>
    )
}
