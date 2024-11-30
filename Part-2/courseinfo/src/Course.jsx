const Course=({course})=>{
    return(
        <div>
          <h2>{course.name}</h2>
          {course.parts.map((value)=>(
            <p key={value.id}>
              {value.name} {value.exercises}
            </p>
          ))}
          <Total course={course}/>
        </div>
    )
}
const Total=({course})=>{
    return(
      <p><strong>total of {course.parts.reduce((sum,part)=>sum+part.exercises,0)} exercises</strong></p>
    )
  }

export default Course;