import StatisticsLine from './StatisticsLine';
const Statistics=(props)=>{
    if (props.total === 0) {
        return <p>No feedback given</p>;
    }
    return(
        <div>
            <h2>statistics</h2>
            <StatisticsLine text="good" value={props.good}/>
            <StatisticsLine text="neutral" value={props.neutral}/>
            <StatisticsLine text="bad" value={props.bad}/>
            <StatisticsLine text="all" value={props.total}/>
            <StatisticsLine text="average" value={props.average}/>
            <StatisticsLine text="positive" value={props.positive} />

        </div>
    )
}
export default Statistics;