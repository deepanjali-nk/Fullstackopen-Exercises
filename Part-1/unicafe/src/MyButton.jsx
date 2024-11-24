const MyButton =(props)=>{
    return(
        <button onClick={props.handleClick}> {props.text}</button>
    )
}
export default MyButton;