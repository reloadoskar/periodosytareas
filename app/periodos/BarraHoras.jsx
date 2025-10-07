
export default function BarraHoras({periodos, currentPeriodo}) {
    const renderBar = () => {
        const bar = [];

        if (periodos.length === 0) return null;
        if (currentPeriodo === null) return null;

        periodos.forEach((periodo, index) => {
            const startHour = parseInt(periodo.inicio.split(":")[0], 10) + parseInt(periodo.inicio.split(":")[1], 10) / 60;
            const width = (periodo.horas / 24) * 100;
            const left = (startHour / 24) * 100;
            bar.push(
                <div key={index}
                    style={{
                        position: 'absolute',
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: periodo.color,
                        height: "20px",
                        border: `${periodo.nombre === currentPeriodo.nombre ? "solid 3px" : "none"}`
                    }}>
                </div>
            );
        });

        return bar;
    }

    const renderScale = () => {
        const scale = [];
        for (let i = 0; i <= 24; i++) {
            scale.push(
                <div key={i} style={{
                    position: 'absolute',
                    left: `${(i / 24) * 100}%`,
                    transform: 'translateX(-50%)',
                    height: '20px',
                    borderLeft: '1px solid #000',
                    color: '#000',
                    fontSize: '10px',
                    textAlign: 'center'
                }}>
                    {i}
                </div>
            );
        }
        return scale;
    };
    return (
        <div className='w-full h-6 flex'>
            {renderBar()}
            {renderScale()}
        </div>
    )
}
