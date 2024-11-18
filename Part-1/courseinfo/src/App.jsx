import React from "react";
const Header = ({ value }) => {
  return <h1>{value.course}</h1>;
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((item, index) => (
        <Part key={index} part={item.name} exercises={item.exercises} />
      ))}
    </div>
  );
};

const Total = ({ value }) => {
  const totalExercises = value.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  );
  return <p>Total exercises: {totalExercises}</p>;
};

const App = () => {
  let courseinfo={
    course: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return(
    <div>
      <Header value={courseinfo}/>
      <Content parts={courseinfo.parts}/>
      <Total value={courseinfo}/>
    </div>
  )

}
export default App;