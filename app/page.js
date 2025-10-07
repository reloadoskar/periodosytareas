'use client'
import { useEffect, useState } from "react";
import moment from "moment";
import ProgressBar from "./ProgressBar";
import Reloj from "./Reloj"
import Tareas from "./Tareas";
import CrearTarea from "./CrearTarea";
import Notificador from "./Notificador";
import Periodos from "./periodos/Periodos";
import { FaBars } from "react-icons/fa"; // Importa el icono de hamburguesa
moment.locale("es");

export default function Page() {
	const [periodos, setPeriodos] = useState([])
	const [isMounted, setIsMounted] = useState(false);
	const [showPeriodosMenu, setShowPeriodosMenu] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		const storedPeriodos = localStorage.getItem('periodos');
		if (storedPeriodos) {
			setPeriodos(JSON.parse(storedPeriodos));
		}
	}, []);

	useEffect(() => {
		if (isMounted) {
			localStorage.setItem('periodos', JSON.stringify(periodos));
		}
	}, [periodos, isMounted]);



	const [currentPeriodo, setCurrentPeriodo] = useState(null);
	const [tareas, setTareas] = useState([]);
	const [backgroundColor, setBackgroundColor] = useState("#3d3d3d");

	// Sincroniza periodos con localStorage cada vez que cambian
	useEffect(() => {
		localStorage.setItem('periodos', JSON.stringify(periodos));
	}, [periodos]);

	useEffect(() => {
		const updateBackgroundColor = () => {
			const now = moment();
			const currentHour = now.hours() + now.minutes() / 60;

			for (const periodo of periodos) {
				const startHour = parseInt(periodo.inicio.split(":")[0], 10) + parseInt(periodo.inicio.split(":")[1], 10) / 60;
				const endHour = parseInt(periodo.final.split(":")[0], 10) + parseInt(periodo.final.split(":")[1], 10) / 60;

				if (currentHour >= startHour && currentHour < endHour) {
					setBackgroundColor(periodo.color);
					setCurrentPeriodo(periodo);

					return;
				}
			}
			// Default background color if no period matches
			setBackgroundColor("#3d3d3d");
			setCurrentPeriodo(null);
		};

		updateBackgroundColor();
		const interval = setInterval(() => {
			updateBackgroundColor();
		}, 1000); // Update every second

		return () => clearInterval(interval);
	}, [periodos]);

	const addPeriodo = (nperiodo) => {
        setPeriodos([...periodos, nperiodo])
        // setCreateMode(false)
    }

    const deletePeriodo = (index) => {
        const newPeriodos = periodos.filter((_, i) => i !== index);
        setPeriodos(newPeriodos);
    }

	const editPeriodo = (index, updatedPeriodo) => {
        const newPeriodos = periodos.map((periodo, i) =>
            i === index ? { ...periodo, ...updatedPeriodo } : periodo
        );
        setPeriodos(newPeriodos);

        // Si el periodo editado es el actual, actualiza también currentPeriodo
        if (currentPeriodo && periodos[index].nombre === currentPeriodo.nombre) {
            setCurrentPeriodo({ ...currentPeriodo, ...updatedPeriodo });
        }
    };

	const handleAddTarea = (nuevaTarea) => {
		const add = new Audio('/sounds/add.mp3');
		if (nuevaTarea.text.trim() !== "" && currentPeriodo) {
			add.play();
			// Actualiza el periodo actual con la nueva tarea
			const newPeriodos = periodos.map(periodo => {
				if (periodo.nombre === currentPeriodo.nombre) {
					const tareasActualizadas = periodo.tareas ? [...periodo.tareas, nuevaTarea] : [nuevaTarea];
					return { ...periodo, tareas: tareasActualizadas };
				}
				return periodo;
			});
			setPeriodos(newPeriodos);
			setCurrentPeriodo({
				...currentPeriodo,
				tareas: currentPeriodo.tareas ? [...currentPeriodo.tareas, nuevaTarea] : [nuevaTarea]
			});
		}
	}

	const handleDeleteTarea = (index) => {
		const cancel = new Audio('/sounds/error.mp3');
		cancel.play();
		if (!currentPeriodo) return;

		// Elimina la tarea del periodo actual
		const nuevasTareas = (currentPeriodo.tareas || []).filter((_, i) => i !== index);

		// Actualiza periodos
		const newPeriodos = periodos.map(periodo => {
			if (periodo.nombre === currentPeriodo.nombre) {
				return { ...periodo, tareas: nuevasTareas };
			}
			return periodo;
		});

		setPeriodos(newPeriodos);
		setCurrentPeriodo({ ...currentPeriodo, tareas: nuevasTareas });
	};

	const handleToggleCompleteTarea = (index) => {
		const succes = new Audio('/sounds/succes.mp3');
		const error = new Audio('/sounds/cancel.mp3');
		if (!currentPeriodo) return;

		// Cambia el estado de completado de la tarea
		const nuevasTareas = (currentPeriodo.tareas || []).map((tarea, i) => {
			if (i === index) {
				if (!tarea.completed) {
					succes.play();
				} else {
					error.play();
				}
				return { ...tarea, completed: !tarea.completed };
			}
			return tarea;
		});

		// Actualiza periodos
		const newPeriodos = periodos.map(periodo => {
			if (periodo.nombre === currentPeriodo.nombre) {
				return { ...periodo, tareas: nuevasTareas };
			}
			return periodo;
		});

		setPeriodos(newPeriodos);
		setCurrentPeriodo({ ...currentPeriodo, tareas: nuevasTareas });
	};

	const handleMoveTarea = (index, direction) => {
		const tareasActuales = tareas;
		const newIndex = index + direction;
		if (newIndex < 0 || newIndex >= tareasActuales.length) return;
		const nuevasTareas = [...tareasActuales];
		const [moved] = nuevasTareas.splice(index, 1);
		nuevasTareas.splice(newIndex, 0, moved);

		const newPeriodos = periodos.map(periodo => {
			if (periodo.nombre === currentPeriodo.nombre) {
				return { ...periodo, tareas: nuevasTareas };
			}
			return periodo;
		});
		setPeriodos(newPeriodos);
		setCurrentPeriodo({ ...currentPeriodo, tareas: nuevasTareas });
	};

	if (!isMounted) return null; // Evita renderizar hasta que esté montado

	return (
		<div className="min-h-screen p-5" style={{ backgroundColor: backgroundColor, transition: "background-color 6s" }}>
			{/* Botón de hamburguesa */}
			<button
				className="fixed top-5 left-5 z-50 bg-gray-900 text-white p-2 rounded-full shadow-lg"
				onClick={() => setShowPeriodosMenu(true)}
			>
				<FaBars size={24} />
			</button>

			{/* Menú lateral deslizante */}
			<div
				className={`fixed top-0 left-0 h-full w-3/4 bg-teal-300/85 shadow-lg z-40 transition-transform duration-300 ${showPeriodosMenu ? "translate-x-0" : "-translate-x-full"
					}`}
			>
				{/* Botón para cerrar el menú */}
				<button
					className="absolute top-4 right-4 text-gray-800"
					onClick={() => setShowPeriodosMenu(false)}
				>
					X
				</button>
				<Periodos 
					periodos={periodos} 
					setPeriodos={setPeriodos} 
					currentPeriodo={currentPeriodo} 
					addPeriodo={addPeriodo} 
					deletePeriodo={deletePeriodo} 
					editPeriodo={editPeriodo}
				/>
			</div>

			<Notificador currentPeriodo={currentPeriodo} />
			<div className="text-slate-950 text-center md:text-right md:pr-28 pr-5">
				<Reloj />
			</div>

			{currentPeriodo ? (
				<div className="w-3/4 m-auto">
					<h1 className="ttlbig">{currentPeriodo.nombre}</h1>
					<ProgressBar currentPeriodo={currentPeriodo} />
				</div>
			) : <div className="titulo"> {"<--Crea un periodo para empezar a trabajar con tareas"} </div>}

			<Tareas
				currentPeriodo={currentPeriodo}
				tareas={currentPeriodo?.tareas || []}
				handleDeleteTarea={handleDeleteTarea}
				handleToggleCompleteTarea={handleToggleCompleteTarea}
				handleMoveTarea={handleMoveTarea}
			/>

			<CrearTarea handleAddTarea={handleAddTarea} currentPeriodo={currentPeriodo} />

		</div>
	);
}