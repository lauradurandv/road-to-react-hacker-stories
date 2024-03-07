import * as React from 'react';
//Global Variables


//Functions
const getTitle = (title) => (title);


//Components
const List = (props) => (
  <ul>
    {props.list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

const Item = (props) => (
  <li>
    <span>
        <a href={props.item.url}>{props.item.title}</a>
    </span>
    <span>
      {props.item.author}
    </span>
    <span>
      {props.item.num_comments}
    </span>
    <span>
      {props.item.points}
    </span>
  </li>
)

const Search = (props) => {
  //React state
  const [searchTerm, setSearchTerm] = React.useState('');

  //handle change
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    props.onSearch(event);
  }
  return(
    <div>
      <label htmlFor='search'> Search:
        <input id="search" type="text"/>
      </label>
    </div>
    );
  };



//Parent Component
const App = () => {

  //variable
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  //Callback handler
  const handleSearch = (event) => {
    console.log(event.target.value);
  };

  return(
  <div>
      <h1>{getTitle("My Hacker Stories")}</h1>
      < Search onSearch={handleSearch}/>
      <hr/>
      < List list={stories}/>
    </div>
  );
  };
export default App;
