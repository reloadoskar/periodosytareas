import moment from "moment";
import { useEffect, useState } from "react";

export default function ProgressBar({ currentPeriodo }) {
    if (!currentPeriodo) return null;
    const [start,setStart] = useState()
    const [end,setEnd] = useState()
    const [duracion,setDuracion] = useState(0)
    const [transcurrido,setTranscurrido] = useState(0)
    const [percentage,setPercentage] = useState(0)

    useEffect(() => {
        const updateBar = () => {
            const now = moment();
            const start = moment(currentPeriodo.inicio, "HH:mm");
            const end = moment(currentPeriodo.final, "HH:mm");
            const duration = end.diff(start);
            const duracion = end.diff(start, "minutes");
            const elapsed = now.diff(start);
            const transcurrido = now.diff(start, "minutes");
            const percentage = Math.max(0, Math.min(100, (elapsed / duration) * 100));
            setStart(start);
            setEnd(end);
            setDuracion(duracion);
            setTranscurrido(transcurrido);
            setPercentage(percentage);
        }
        updateBar();
        const interval = setInterval(() => {
            updateBar();
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [currentPeriodo]);
    return (
        <div>
            <div className=" flex flex-col shadow-sm shadow-slate-700/60 w-full " style={{ backgroundColor: currentPeriodo.color, opacity: "80%", borderRadius: "3px", overflow: "hidden", marginTop: "10px" }}>
                <div className="transition-transform duration-1000 ease-in-out" style={{ width: `${percentage}%`, backgroundColor: "#242424", opacity: "90%", height: "20px" }}></div>
            </div>
            <div className="flex justify-between">
                <p>{currentPeriodo.inicio}</p>
                <p>{currentPeriodo.final}</p>
            </div>
            <div className="text-center">
                <p>duración: {duracion > 60 ? (duracion / 60) + " hrs" : duracion + " min"} | Quedan: {parseInt(duracion) - parseInt(transcurrido)} min</p>
            </div>
        </div>
    )
}
